<?php
namespace App\Http\Controllers\Traits;

use Illuminate\Http\Request;

trait HasSearch
{
public function search(Request $request)
{
$q = $request->input('q');
$model = $this->model; // definisikan di controller

$query = $model::query();

// ambil dari property $searchableFields di controller
foreach ($this->searchableFields as $field) {
$query->orWhere($field, 'like', "%{$q}%");
}

return response()->json(
$query->select($this->searchableFields + ['id'])
->limit(10)
->get()
);
}
}