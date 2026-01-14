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


namespace App\Models{
/**
 * @property-read \App\Models\Keanggotaan\Anggota|null $anggota
 * @property-read \App\Models\Core\User|null $createdBy
 * @property-read \App\Models\Master\RefIuran|null $refIuran
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CollectorReceipt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CollectorReceipt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CollectorReceipt query()
 * @mixin \Eloquent
 */
	class CollectorReceipt extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @mixin IdeHelperAuthLog
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
	class AuthLog extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @property-read Anggota|null $anggota
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog query()
 * @mixin \Eloquent
 */
	class NotificationLog extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @mixin IdeHelperPasswordResetToken
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
	class PasswordResetToken extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @mixin IdeHelperSession
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
	class Session extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @mixin IdeHelperUser
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
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Core\UserDevice> $devices
 * @property-read int|null $devices_count
 * @mixin \Eloquent
 */
	class User extends \Eloquent {}
}

namespace App\Models\Core{
/**
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice query()
 * @mixin \Eloquent
 */
	class UserDevice extends \Eloquent {}
}

namespace App\Models\Keanggotaan{
/**
 * @mixin IdeHelperAlamat
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
	class Alamat extends \Eloquent {}
}

namespace App\Models\Keanggotaan{
/**
 * @mixin IdeHelperAnggota
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
 * @property-read mixed $alamat
 * @mixin \Eloquent
 */
	class Anggota extends \Eloquent {}
}

namespace App\Models\Keanggotaan{
/**
 * @mixin IdeHelperKeluarga
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
	class Keluarga extends \Eloquent {}
}

namespace App\Models\Keanggotaan{
/**
 * @mixin IdeHelperUserAnggotaRequest
 * @property int $id
 * @property int $user_id
 * @property int $anggota_id
 * @property string|null $no_hp
 * @property string|null $email
 * @property int|null $perum_id
 * @property string|null $no_rumah
 * @property string|null $alamat_lainnya
 * @property int|null $village_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read Perum|null $perum
 * @property-read User $user
 * @property-read Village|null $village
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
	class UserAnggotaRequest extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\AccountBalance> $account_balances
 * @property-read int|null $account_balances_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Account> $children
 * @property-read int|null $children_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\JournalLine> $journal_lines
 * @property-read int|null $journal_lines_count
 * @property-read Account|null $parent
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @mixin \Eloquent
 */
	class Account extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperAccountBalance
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
	class AccountBalance extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperIuran
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
	class Iuran extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperIuranSetoran
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
	class IuranSetoran extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperJournalEntry
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
	class JournalEntry extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperJournalLine
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
	class JournalLine extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperPengeluaran
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
	class Pengeluaran extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperSetoranKolektor
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
 * @property-read \App\Models\Core\User|null $bendahara
 * @property-read \App\Models\Core\User|null $kolektor
 * @mixin \Eloquent
 */
	class SetoranKolektor extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperSubledger
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
	class Subledger extends \Eloquent {}
}

namespace App\Models\Keuangan{
/**
 * @mixin IdeHelperSumbangan
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
	class Sumbangan extends \Eloquent {}
}

namespace App\Models\Master{
/**
 * @mixin IdeHelperPerum
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
	class Perum extends \Eloquent {}
}

namespace App\Models\Master{
/**
 * @mixin IdeHelperRefIuran
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
	class RefIuran extends \Eloquent {}
}

namespace App\Models\Support{
/**
 * @mixin IdeHelperSubledger
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
	class Subledger extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMAccbank
 *
 * @property int|null $Perusahaan_kode
 * @property string|null $AccountBank
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank whereAccountBank($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
	class TblMAccbank extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMAccount
 *
 * @property string $Account
 * @property string|null $Account_Desc
 * @property string|null $Account_long_desc
 * @property string|null $Account_type
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountDesc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountLongDesc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountType($value)
 * @mixin \Eloquent
 */
	class TblMAccount extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMAmaame
 *
 * @property int $AMAAME_kode
 * @property string|null $AMAAME_Nama
 * @property string|null $AMAAME_EMAIL
 * @property string|null $AMAAME_EMAIL_STAFF
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEEMAIL($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEEMAILSTAFF($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMENama($value)
 * @mixin \Eloquent
 */
	class TblMAmaame extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $BA_NAME_LONG
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $Email_Gudang
 * @property string|null $BA_kode_AMA
 * @property string|null $BA_Manager
 * @property string|null $BA_KTU_KASIE1
 * @property string|null $BA_KTU_KASIE2
 * @property string|null $BA_Manager_contact
 * @property string|null $Ba_KTU_KASIE1_contact
 * @property string|null $Ba_KTU_KASIE2_contact
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKodeAMA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAManager($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAManagerContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBaKTUKASIE1Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBaKTUKASIE2Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailTraksi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
	class TblMBa extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMBankKey
 *
 * @property int $bankkey_id
 * @property string|null $Country Code
 * @property string|null $Bank Code
 * @property string|null $Bank Name
 * @property string|null $Region
 * @property string|null $Street Address
 * @property string|null $City
 * @property string|null $Bank Group
 * @property string|null $Bank Number
 * @property string|null $Bank Branch
 * @package App\Models
 * @property string|null $Country Code
 * @property string|null $Bank Code
 * @property string|null $Bank Name
 * @property string|null $Street Address
 * @property string|null $Bank Group
 * @property string|null $Bank Number
 * @property string|null $Bank Branch
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankkeyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereCountryCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereRegion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereStreetAddress($value)
 * @mixin \Eloquent
 * @property string|null $Country Code
 * @property string|null $Bank Code
 * @property string|null $Bank Name
 * @property string|null $Street Address
 * @property string|null $Bank Group
 * @property string|null $Bank Number
 * @property string|null $Bank Branch
 */
	class TblMBankKey extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMCostcenter
 *
 * @property string $CostCenter
 * @property string|null $Description
 * @property string|null $ShortCC
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereShortCC($value)
 * @mixin \Eloquent
 */
	class TblMCostcenter extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMCustomer
 *
 * @property string $CustomerID
 * @property string|null $NamaCustomer
 * @property string|null $ShortCustomer
 * @property string|null $CityCustomer
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereCityCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereCustomerID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereNamaCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereShortCustomer($value)
 * @mixin \Eloquent
 */
	class TblMCustomer extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMGroup
 *
 * @property int $GID
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGroupName($value)
 * @mixin \Eloquent
 */
	class TblMGroup extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMKend
 *
 * @property int $KID
 * @property string|null $K_TYPE
 * @property string|null $k_CocD
 * @property string|null $K_BusA
 * @property string|null $K_DESC
 * @property string|null $K_TNKB
 * @property string|null $K_CC
 * @property string|null $K_TNKB_OLD
 * @property string|null $K_RANGKA
 * @property string|null $K_MESIN
 * @property string|null $K_ACTIVE
 * @property string|null $K_Comment
 * @property Carbon|null $K_Tgl_valid_STNKB
 * @property Carbon|null $K_tgl_valid_PKB
 * @property Carbon|null $K_tgl_valid_KIER
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKACTIVE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKCocD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKMESIN($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKRANGKA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTNKBOLD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTYPE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidSTNKB($value)
 * @mixin \Eloquent
 */
	class TblMKend extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMModul
 *
 * @property int $MID
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereModulName($value)
 * @mixin \Eloquent
 */
	class TblMModul extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMPayto
 *
 * @property int $payto_id
 * @property string|null $payto
 * @property string|null $payto_bankkey
 * @property string|null $payto_norek
 * @property string|null $payto_account_holder
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePayto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoAccountHolder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoBankkey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoNorek($value)
 * @mixin \Eloquent
 */
	class TblMPayto extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMPengguna
 *
 * @property int $Pengguna_kode
 * @property string $Pengguna_nama
 * @property string $Pengguna_login_nama
 * @property string $pengguna_login_pass
 * @property string|null $pengguna_sap
 * @property string|null $pengguna_email
 * @property string|null $pengguna_email_user
 * @property string|null $pengguna_email_pass
 * @property string|null $pengguna_ext
 * @property string|null $Pengguna_serversap
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmailPass($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmailUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaExt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaLoginNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaLoginPass($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaSap($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaServersap($value)
 * @mixin \Eloquent
 */
	class TblMPengguna extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMPerusahaan
 *
 * @property int $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanNama($value)
 * @mixin \Eloquent
 */
	class TblMPerusahaan extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMPk
 *
 * @property string $PK
 * @property string|null $AccTy
 * @property string|null $DC
 * @property string|null $PKName
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk whereAccTy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk whereDC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk wherePK($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk wherePKName($value)
 * @mixin \Eloquent
 */
	class TblMPk extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMTahap
 *
 * @property int $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property Carbon|null $Tahap_Tanggal_Awal
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapTanggalAwal($value)
 * @mixin \Eloquent
 */
	class TblMTahap extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMVendor
 *
 * @property int $Vendor_Kode
 * @property string|null $Vendor_Nama
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
	class TblMVendor extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblMenu
 *
 * @property int $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuParent($value)
 * @mixin \Eloquent
 */
	class TblMenu extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTAuth
 *
 * @property int $Auth_Num
 * @property int|null $Auth_Modul_No
 * @property int|null $Auth_Add
 * @property int|null $Auth_Edit
 * @property int|null $Auth_delete
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthDelete($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthEdit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthModulNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth wherePenggunaKode($value)
 * @mixin \Eloquent
 */
	class TblTAuth extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTDnuploaddetail
 *
 * @property int $headerId
 * @property int $lineItem
 * @property string|null $BaOrigin
 * @property string|null $baDestination
 * @property string|null $postingDate
 * @property string|null $description
 * @property float|null $amount
 * @property string|null $account
 * @property string|null $costcenter
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereBaDestination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereBaOrigin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereCostcenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereLineItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail wherePostingDate($value)
 * @mixin \Eloquent
 */
	class TblTDnuploaddetail extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTDnuploadheader
 *
 * @property int $headerId
 * @property string|null $BaOrigin
 * @property string|null $BaDestination
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereBaDestination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereBaOrigin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereHeaderId($value)
 * @mixin \Eloquent
 */
	class TblTDnuploadheader extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTKendBebanDetail
 *
 * @property int $kend_detail_id
 * @property int $kend_header_id
 * @property Carbon|null $tgl_awal_detail
 * @property Carbon|null $tgl_akhir_detail
 * @property int|null $km_awal_detail
 * @property int|null $km_akhir_detail
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @property int|null $biaya_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereBiayaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKmAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKmAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereTglAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereTglAwalDetail($value)
 * @mixin \Eloquent
 */
	class TblTKendBebanDetail extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTKendBebanHeader
 *
 * @property int $kend_header_id
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $kend_id
 * @property int|null $tahun_header
 * @property int|null $bulan_header
 * @property float|null $total_biaya_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTotalBiayaHeader($value)
 * @mixin \Eloquent
 */
	class TblTKendBebanHeader extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTPenerimaan
 *
 * @property int $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property int|null $Tahap_Kode
 * @property int $Pengguna_kode
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property string|null $Penerimaan_Attachment1
 * @property string|null $Penerimaan_Attachment2
 * @property string|null $Penerimaan_Attachment3
 * @property string|null $penerimaan_invoice
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment3($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanInvoice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereVendorKode($value)
 * @mixin \Eloquent
 */
	class TblTPenerimaan extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTPenggunaGroup
 *
 * @property int $PGID
 * @property int|null $GID
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup wherePGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup wherePenggunaKode($value)
 * @mixin \Eloquent
 */
	class TblTPenggunaGroup extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTPermission
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission wherePVal($value)
 * @mixin \Eloquent
 */
	class TblTPermission extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTPerpjHead
 *
 * @property int $perpj_head_id
 * @property int|null $Perpj_head_cocd
 * @property string|null $Perpj_head_vendor_acc
 * @property string|null $Perpj_head_vendor_nama
 * @property string|null $Perpj_head_ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadVendorAcc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadVendorNama($value)
 * @mixin \Eloquent
 */
	class TblTPerpjHead extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTPerpjItem
 *
 * @property int|null $perpj_head_id
 * @property int|null $perpj_item_id
 * @property string|null $perpj_item_nopol
 * @property string|null $perpj_item_cc
 * @property string|null $perpj_item_busa
 * @property int|null $perpj_item_biaya
 * @property int|null $perpj_item_jasa
 * @property int|null $perpj_item_denda
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjHeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemBiaya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemBusa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemCc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemDenda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemNopol($value)
 * @mixin \Eloquent
 */
	class TblTPerpjItem extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTStatus
 *
 * @property int $status_kode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusValue($value)
 * @mixin \Eloquent
 */
	class TblTStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTTemplateBebanKendDetail
 *
 * @property int $tmp_detail_id
 * @property int|null $tmp_header_id
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereTmpDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereTmpHeaderId($value)
 * @mixin \Eloquent
 */
	class TblTTemplateBebanKendDetail extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblTTemplateBebanKendHeader
 *
 * @property int $tmp_header_id
 * @property string|null $tmp_header_nama
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader whereTmpHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader whereTmpHeaderNama($value)
 * @mixin \Eloquent
 */
	class TblTTemplateBebanKendHeader extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblUploadF53
 *
 * @property int $kode_upload
 * @property int|null $Perusahaan_kode
 * @property int|null $Tahap_kode
 * @property string|null $Doc_Date
 * @property string|null $Assign
 * @property int|null $BA_kode
 * @property int|null $Vendor_kode
 * @property float|null $Amount
 * @property string|null $PO_number
 * @property string|null $PO_Text
 * @property string|null $doc_num
 * @property string|null $ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereAssign($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereDocNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereKodeUpload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePONumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePOText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereVendorKode($value)
 * @mixin \Eloquent
 */
	class TblUploadF53 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblUploadPph23
 *
 * @property int $Cocd
 * @property int $Bulan
 * @property int $tahun
 * @property int $count
 * @property string $PostingDate
 * @property string $DocRef
 * @property string $Reference
 * @property string|null $BusArea
 * @property float|null $amount
 * @property string|null $vendor_kode
 * @property string|null $Po_text
 * @property string|null $PO
 * @property string|null $pph
 * @property string|null $GLAccount
 * @property string|null $DocDate
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereDocRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePoText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePph($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereVendorKode($value)
 * @mixin \Eloquent
 */
	class TblUploadPph23 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class TblUploadZf
 *
 * @property int $JurnalRef
 * @property int $No
 * @property string $CompanyCode
 * @property string $PostingDate
 * @property string $Period
 * @property string $DocumentDate
 * @property string|null $DocumentType
 * @property string|null $IDR
 * @property string|null $ExchangeRate
 * @property string|null $Reference
 * @property string|null $DocumentHeaderText
 * @property string|null $DebetCredit
 * @property string|null $GLAccount
 * @property string|null $VendorAccount
 * @property string|null $CustomerAccount
 * @property string|null $SPGLInd
 * @property string|null $AmountInDoc
 * @property string|null $BusArea
 * @property string|null $CostCenter
 * @property string|null $ProfitCenter
 * @property string|null $WBS
 * @property string|null $Assignment
 * @property string|null $Text
 * @property string|null $TaxCode
 * @property string|null $TradingPartner
 * @property string|null $TermofPayment
 * @property string|null $BaseLineDate
 * @property string|null $NumberofDays
 * @property string|null $ValueDate
 * @property string|null $TransactionType
 * @property string|null $Refkey1
 * @property string|null $AuFnR
 * @property string|null $Refkey2
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAmountInDoc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAssignment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAuFnR($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereBaseLineDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCustomerAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDebetCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentHeaderText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereIDR($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereJurnalRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereNumberofDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf wherePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereProfitCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereRefkey1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereRefkey2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereSPGLInd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTaxCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTermofPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTradingPartner($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTransactionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereValueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereVendorAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereWBS($value)
 * @mixin \Eloquent
 */
	class TblUploadZf extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewBaSearch
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $BA_NAME_LONG
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
	class ViewBaSearch extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewBebanKendDetail
 *
 * @property int $kend_detail_id
 * @property int $kend_header_id
 * @property Carbon|null $tgl_awal_detail
 * @property Carbon|null $tgl_akhir_detail
 * @property int|null $km_awal_detail
 * @property int|null $km_akhir_detail
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @property int|null $kend_id
 * @property string|null $K_DESC
 * @property string|null $K_CC
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $Total_KM_Header
 * @property int|null $Total_KM
 * @property float|null $total_biaya_header
 * @property float|null $total_biaya
 * @property int|null $bulan_header
 * @property int|null $tahun_header
 * @property string|null $K_TNKB
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property string|null $NamaCustomer
 * @property string|null $Description
 * @property float|null $rate_KM
 * @property int|null $biaya_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBiayaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereNamaCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereRateKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalBiaya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalBiayaHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalKMHeader($value)
 * @mixin \Eloquent
 */
	class ViewBebanKendDetail extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewBebanKendHeader
 *
 * @property int $kend_header_id
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $tahun_header
 * @property int|null $bulan_header
 * @property int|null $kend_id
 * @property string|null $K_DESC
 * @property string|null $K_TNKB
 * @property string|null $K_CC
 * @property float|null $total_biaya_header
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property string|null $pencarian
 * @property float|null $rate_KM
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereRateKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTotalBiayaHeader($value)
 * @mixin \Eloquent
 */
	class ViewBebanKendHeader extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCariBeban
 *
 * @property string $AccBeban
 * @property string|null $NamaBeban
 * @property string|null $short
 * @property string|null $pencarian
 * @property string $typebeban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereAccBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereNamaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereShort($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereTypebeban($value)
 * @mixin \Eloquent
 */
	class ViewCariBeban extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCcKend
 *
 * @property string $CostCenter
 * @property string|null $descriptions
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend whereDescriptions($value)
 * @mixin \Eloquent
 */
	class ViewCcKend extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCompanyNama
 *
 * @property string|null $company
 * @property int $kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama whereCompany($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama whereKode($value)
 * @mixin \Eloquent
 */
	class ViewCompanyNama extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCountPenerimaanByPt
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Jenis_PO
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereJenisPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereTahapNama($value)
 * @mixin \Eloquent
 */
	class ViewCountPenerimaanByPt extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCountPenerimaanByPtTahapTempat
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat whereTahapNama($value)
 * @mixin \Eloquent
 */
	class ViewCountPenerimaanByPtTahapTempat extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewCountPenerimaanByPtTahapTempatJeni
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Jenis_PO
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereJenisPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereTahapNama($value)
 * @mixin \Eloquent
 */
	class ViewCountPenerimaanByPtTahapTempatJeni extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewDetailBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $BA_kode_AMA
 * @property string|null $Perusahaan_Nama
 * @property string|null $BA_NAME_LONG
 * @property string|null $BA_Manager
 * @property string|null $BA_KTU_KASIE1
 * @property string|null $BA_KTU_KASIE2
 * @property string|null $BA_Manager_contact
 * @property string|null $Ba_KTU_KASIE1_contact
 * @property string|null $Ba_KTU_KASIE2_contact
 * @property string|null $Email_Gudang
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKodeAMA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAManager($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAManagerContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBaKTUKASIE1Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBaKTUKASIE2Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailTraksi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa wherePerusahaanNama($value)
 * @mixin \Eloquent
 */
	class ViewDetailBa extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewEmailBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $email
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereEmail($value)
 * @mixin \Eloquent
 */
	class ViewEmailBa extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewEmailBa2
 *
 * @property int $BA_Kode
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $Email_Gudang
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailTraksi($value)
 * @mixin \Eloquent
 */
	class ViewEmailBa2 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewGp
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePVal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePenggunaNama($value)
 * @mixin \Eloquent
 */
	class ViewGp extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewGroupUser
 *
 * @property int $PGID
 * @property int|null $GID
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePenggunaNama($value)
 * @mixin \Eloquent
 */
	class ViewGroupUser extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewLapByCompany
 *
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $icat
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int $jumlah
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereTahapNama($value)
 * @mixin \Eloquent
 */
	class ViewLapByCompany extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewListBebanSimple
 *
 * @property int $kend_header_id
 * @property int $kend_detail_id
 * @property string|null $costcenter_beban
 * @property string|null $Description
 * @property string|null $customer_beban
 * @property string|null $NamaCustomer
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereNamaCustomer($value)
 * @mixin \Eloquent
 */
	class ViewListBebanSimple extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewListKendaraan
 *
 * @property int $KID
 * @property string|null $type_kend
 * @property string|null $COcd
 * @property string|null $BusA
 * @property string|null $desk
 * @property string|null $TNKB
 * @property string|null $CC
 * @property string|null $TNKB_OLD
 * @property string|null $Rangka
 * @property string|null $Mesin
 * @property string|null $Aktive
 * @property string|null $keterangan
 * @property string|null $pencarian
 * @property Carbon|null $tgl_STNKB
 * @property Carbon|null $tgl_PKB
 * @property Carbon|null $tgl_KIER
 * @property int|null $hari_perpj_STNKB
 * @property int|null $hari_perpj_PKB
 * @property int|null $hari_perpj_KIER
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereAktive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereCOcd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereDesk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjSTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereKID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereMesin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereRangka($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTNKBOLD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglSTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTypeKend($value)
 * @mixin \Eloquent
 */
	class ViewListKendaraan extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewMaxstat
 *
 * @property int $maxkode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereMaxkode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusValue($value)
 * @mixin \Eloquent
 */
	class ViewMaxstat extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewMaxstat2
 *
 * @property int $maxkode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @property int|null $maxid
 * @property Carbon|null $maxtg
 * @property int|null $kode_Terima
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereKodeTerima($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxkode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxtg($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusValue($value)
 * @mixin \Eloquent
 */
	class ViewMaxstat2 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewMenu
 *
 * @property int|null $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property int|null $jumlahchild
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereJumlahchild($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuParent($value)
 * @mixin \Eloquent
 */
	class ViewMenu extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewMenuByGroupPermission
 *
 * @property int $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property int|null $GID
 * @property string|null $Group_Name
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuParent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission wherePenggunaNama($value)
 * @mixin \Eloquent
 */
	class ViewMenuByGroupPermission extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewMenuByPengguna
 *
 * @property int|null $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property int|null $jumlahchild
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @property string|null $Modul_Name
 * @property int|null $PVal
 * @property string|null $Modul_description
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereJumlahchild($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuParent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna wherePVal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna wherePenggunaKode($value)
 * @mixin \Eloquent
 */
	class ViewMenuByPengguna extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewPayto
 *
 * @property int $id_rek
 * @property string|null $nama_rek
 * @property string|null $bank_rek
 * @property string|null $no_rek
 * @property string|null $acchold_rek
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereAccholdRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereBankRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereIdRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereNamaRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereNoRek($value)
 * @mixin \Eloquent
 */
	class ViewPayto extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewPenerimaan
 *
 * @property int|null $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property string|null $vendor
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $Penerimaan_Attachment1
 * @property string|null $Penerimaan_Attachment2
 * @property string|null $Penerimaan_Attachment3
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment3($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorNama($value)
 * @mixin \Eloquent
 */
	class ViewPenerimaan extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewPenerimaan2
 *
 * @property int $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property string|null $vendor
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property int|null $status_value
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorNama($value)
 * @mixin \Eloquent
 */
	class ViewPenerimaan2 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewPermisionModulGrupuser
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser wherePVal($value)
 * @mixin \Eloquent
 */
	class ViewPermisionModulGrupuser extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewPilihTemplate
 *
 * @property int $tmp_detail_id
 * @property int|null $tmp_header_id
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereTmpDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereTmpHeaderId($value)
 * @mixin \Eloquent
 */
	class ViewPilihTemplate extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewStatMax
 *
 * @property int|null $maxid
 * @property Carbon|null $maxtg
 * @property int|null $kode_Terima
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereKodeTerima($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereMaxid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereMaxtg($value)
 * @mixin \Eloquent
 */
	class ViewStatMax extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewStatus
 *
 * @property int|null $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property int|null $status_kode
 * @property int|null $status_value
 * @property string|null $status_reason
 * @property string|null $status_action
 * @property Carbon|null $status_tanggal
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereVendorNama($value)
 * @mixin \Eloquent
 */
	class ViewStatus extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewStatusMax
 *
 * @property int|null $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property int|null $status_kode
 * @property int|null $status_value
 * @property string|null $status_reason
 * @property string|null $status_action
 * @property Carbon|null $status_tanggal
 * @property int|null $kode
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereVendorNama($value)
 * @mixin \Eloquent
 */
	class ViewStatusMax extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewTahap
 *
 * @property int $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property Carbon|null $Tahap_Tanggal_Awal
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapTanggalAwal($value)
 * @mixin \Eloquent
 */
	class ViewTahap extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewUpload53
 *
 * @property int|null $kode_upload
 * @property int|null $Perusahaan_kode
 * @property int|null $Tahap_kode
 * @property string|null $Doc_Date
 * @property int|null $BA_kode
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property float|null $Amount
 * @property string|null $PO_number
 * @property string|null $Assign
 * @property string|null $PO_Text
 * @property string|null $Doc_num
 * @property string|null $ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereAssign($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereDocNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereKodeUpload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePONumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePOText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereVendorNama($value)
 * @mixin \Eloquent
 */
	class ViewUpload53 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewUploadPph23
 *
 * @property int $Cocd
 * @property int $Bulan
 * @property int $tahun
 * @property int $count
 * @property string $PostingDate
 * @property string $DocRef
 * @property string $Reference
 * @property string|null $BusArea
 * @property float|null $Amount
 * @property string|null $vendor_kode
 * @property string|null $Po_text
 * @property string|null $Vendor_Nama
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $PO
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @property string|null $pph
 * @property string|null $GLAccount
 * @property string|null $Perusahaan_Nama
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $DocDate
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereDocRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePoText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePph($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
	class ViewUploadPph23 extends \Eloquent {}
}

namespace App\Models{
/**
 * Class ViewVendorNama
 *
 * @property string|null $vendor
 * @property int $kode
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
	class ViewVendorNama extends \Eloquent {}
}

