<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models\Core{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string $action
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string $logged_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereLoggedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAuthLog {}
}

namespace App\Models\Core{
/**
 * @property string $email
 * @property string $token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PasswordResetToken whereToken($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPasswordResetToken {}
}

namespace App\Models\Core{
/**
 * @property int $id
 * @property int|null $user_id
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string $payload
 * @property int $last_activity
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session whereLastActivity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session wherePayload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Session whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSession {}
}

namespace App\Models\Core{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $google_id
 * @property string|null $avatar
 * @property string|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property string|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property string|null $profile_photo_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $anggota_id
 * @property-read \App\Models\Keanggotaan\Anggota|null $anggota
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Passport\Client> $clients
 * @property-read int|null $clients_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Passport\Client> $oauthApps
 * @property-read int|null $oauth_apps_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Permission> $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Spatie\Permission\Models\Role> $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\SetoranKolektor> $setoran_kolektors
 * @property-read int|null $setoran_kolektors_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Passport\Token> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\Core\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User permission($permissions, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User role($roles, $guard = null, $without = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCurrentTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProfilePhotoPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorRecoveryCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutPermission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutRole($roles, $guard = null)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

namespace App\Models\Keanggotaan{
/**
 * @property int $id
 * @property int $anggota_id
 * @property int|null $perum_id
 * @property string|null $no_rumah
 * @property string|null $alamat_lainnya
 * @property int|null $village_id
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read \App\Models\Master\Perum|null $perum
 * @property-read \Laravolt\Indonesia\Models\Village|null $village
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereAlamatLainnya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereNoRumah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat wherePerumId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereVillageId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAlamat {}
}

namespace App\Models\Keanggotaan{
/**
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property string $nama
 * @property string|null $jenis_kelamin
 * @property string|null $no_hp
 * @property string|null $no_kk
 * @property string|null $no_ktp
 * @property string|null $email
 * @property string $status
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Alamat> $alamats
 * @property-read int|null $alamats_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\Iuran> $iurans
 * @property-read int|null $iurans_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Keluarga> $keluargas
 * @property-read int|null $keluargas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Core\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\Keanggotaan\AnggotaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoKk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoKtp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAnggota {}
}

namespace App\Models\Keanggotaan{
/**
 * @property int $id
 * @property string|null $kode
 * @property int $anggota_id
 * @property string $nama
 * @property string|null $no_ktp
 * @property string|null $no_hp
 * @property string|null $no_kk
 * @property string $hubungan
 * @property string|null $tanggal_lahir
 * @property string|null $jenis_kelamin
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @method static \Database\Factories\Keanggotaan\KeluargaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereHubungan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoKk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoKtp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereTanggalLahir($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperKeluarga {}
}

namespace App\Models\Keanggotaan{
/**
 * @property int $id
 * @property int $user_id
 * @property int $anggota_id
 * @property string|null $no_hp
 * @property int|null $perum_id
 * @property string|null $no_rumah
 * @property string|null $alamat_lainnya
 * @property int|null $village_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read \App\Models\Master\Perum|null $perum
 * @property-read \App\Models\Core\User $user
 * @property-read \Laravolt\Indonesia\Models\Village|null $village
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereAlamatLainnya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereNoRumah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest wherePerumId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereVillageId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUserAnggotaRequest {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string|null $company_code
 * @property string|null $kode
 * @property string|null $nama
 * @property int|null $parent_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\AccountBalance> $account_balances
 * @property-read int|null $account_balances_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\JournalLine> $journal_lines
 * @property-read int|null $journal_lines_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAccount {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string $company_code
 * @property int $account_id
 * @property string|null $subledger_type
 * @property int|null $subledger_id
 * @property int $year
 * @property int $month
 * @property string|null $opening_balance
 * @property string|null $debit_total
 * @property string|null $credit_total
 * @property string|null $closing_balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Account $account
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereClosingBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCreditTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereDebitTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereOpeningBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereSubledgerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereSubledgerType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereYear($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAccountBalance {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property int $anggota_id
 * @property int $ref_iuran_id
 * @property int $jumlah
 * @property string $tanggal_bayar
 * @property string|null $periode_bulan
 * @property string|null $catatan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\IuranSetoran> $iuran_setorans
 * @property-read int|null $iuran_setorans_count
 * @property-read \App\Models\Master\RefIuran $ref_iuran
 * @method static \Database\Factories\Keuangan\IuranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCatatan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran wherePeriodeBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereRefIuranId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereTanggalBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperIuran {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property int $iuran_id
 * @property int $setoran_kolektor_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Iuran $iuran
 * @property-read \App\Models\Keuangan\SetoranKolektor $setoran_kolektor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereIuranId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereSetoranKolektorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperIuranSetoran {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property string $date
 * @property string|null $reference
 * @property string|null $description
 * @property string|null $source_module
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\JournalLine> $journal_lines
 * @property-read int|null $journal_lines_count
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereSourceModule($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperJournalEntry {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property int $journal_entry_id
 * @property int $account_id
 * @property string|null $debit
 * @property string|null $credit
 * @property string|null $subledger_type
 * @property int|null $subledger_id
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Account $account
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereDebit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereJournalEntryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereSubledgerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereSubledgerType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperJournalLine {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string $company_code
 * @property string $tanggal
 * @property int $jumlah
 * @property string $jenis_pengeluaran
 * @property string|null $keterangan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Keuangan\PengeluaranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereJenisPengeluaran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPengeluaran {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string|null $kode
 * @property int $kolektor_id
 * @property int $bendahara_id
 * @property string $tanggal
 * @property string $nominal_total
 * @property int|null $journal_entry_id_setoran
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\IuranSetoran> $iuran_setorans
 * @property-read int|null $iuran_setorans_count
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereBendaharaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereJournalEntryIdSetoran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereKolektorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereNominalTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSetoranKolektor {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string $type
 * @property int $entity_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSubledger {}
}

namespace App\Models\Keuangan{
/**
 * @property int $id
 * @property string $company_code
 * @property string $tanggal
 * @property string|null $nama_penyumbang
 * @property int $jumlah
 * @property string|null $keterangan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Keuangan\SumbanganFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereNamaPenyumbang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSumbangan {}
}

namespace App\Models\Master{
/**
 * @property int $id
 * @property string $nama
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Alamat> $alamats
 * @property-read int|null $alamats_count
 * @method static \Database\Factories\Master\PerumFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPerum {}
}

namespace App\Models\Master{
/**
 * @property int $id
 * @property string $company_code
 * @property string $nama_iuran
 * @property string|null $deskripsi
 * @property string $jumlah
 * @property string $periode
 * @property string|null $tgl_awal_periode
 * @property string|null $tgl_akhir_periode
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Master\RefIuranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereDeskripsi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereNamaIuran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran wherePeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereTglAkhirPeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereTglAwalPeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperRefIuran {}
}

namespace App\Models\Support{
/**
 * @property int $id
 * @property string $type
 * @property int $entity_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperSubledger {}
}

