<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $tables = config('permission.table_names');
        $columns = config('permission.column_names');
        $rolePivot = $columns['role_pivot_key'] ?: 'role_id';
        $permissionPivot = $columns['permission_pivot_key'] ?: 'permission_id';
        $modelPivot = $columns['model_morph_key'] ?: 'model_id';

        foreach (['roles', 'permissions'] as $type) {
            $table = $tables[$type];
            if (! Schema::hasTable($table)) {
                continue;
            }

            $rows = DB::table($table)->get(['id', 'name', 'guard_name']);
            foreach ($rows->groupBy(fn ($row) => Str::lower(trim($row->name))) as $normalizedName => $matches) {
                if ($matches->pluck('guard_name')->unique()->count() > 1) {
                    throw new RuntimeException(
                        "Cannot lowercase {$table}.{$normalizedName}: matching names exist under different guards."
                    );
                }
            }
        }

        DB::transaction(function () use ($tables, $rolePivot, $permissionPivot, $modelPivot) {
            if (Schema::hasTable($tables['roles'])) {
                $this->mergeAndNormalize(
                    $tables['roles'],
                    Str::lower($rolePivot),
                    [
                        [$tables['model_has_roles'], $rolePivot, $modelPivot],
                        [$tables['role_has_permissions'], 'role_id', null],
                    ]
                );
            }

            if (Schema::hasTable($tables['permissions'])) {
                $this->mergeAndNormalize(
                    $tables['permissions'],
                    Str::lower($permissionPivot),
                    [
                        [$tables['model_has_permissions'], $permissionPivot, $modelPivot],
                        [$tables['role_has_permissions'], 'permission_id', null],
                    ]
                );
            }
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function mergeAndNormalize(string $table, string $pivotKey, array $pivots): void
    {
        foreach (DB::table($table)->orderBy('id')->get(['id', 'name', 'guard_name'])
            ->groupBy(fn ($row) => Str::lower(trim($row->name))) as $normalizedName => $matches) {
            $canonicalId = $matches->first()->id;
            $duplicateIds = $matches->pluck('id')->all();

            if (count($duplicateIds) > 1) {
                foreach ($pivots as [$pivotTable, $foreignKey, $modelKey]) {
                    if (! Schema::hasTable($pivotTable)) {
                        continue;
                    }

                    $pivotRows = DB::table($pivotTable)->whereIn($foreignKey, $duplicateIds)->get();
                    if ($pivotRows->isNotEmpty()) {
                        $mergedRows = $pivotRows->map(function ($row) use ($foreignKey, $canonicalId) {
                            $values = (array) $row;
                            $values[$foreignKey] = $canonicalId;

                            return $values;
                        })->all();

                        DB::table($pivotTable)->insertOrIgnore($mergedRows);
                    }

                    DB::table($pivotTable)->whereIn($foreignKey, $duplicateIds)
                        ->where($foreignKey, '!=', $canonicalId)
                        ->delete();
                }

                DB::table($table)->whereIn('id', array_slice($duplicateIds, 1))->delete();
            }

            DB::table($table)->where('id', $canonicalId)->update(['name' => $normalizedName]);
        }
    }

    public function down(): void
    {
        // Original casing and merged duplicate IDs cannot be reconstructed safely.
    }
};
