<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\Vendor;
use App\Models\Stage;
use App\Models\BusinessArea;
use App\Models\CostCenter;
use App\Models\InvoiceReceipt;
use App\Models\ReceiptStatus;
use App\Policies\CompanyPolicy;
use App\Policies\VendorPolicy;
use App\Policies\StagePolicy;
use App\Policies\BusinessAreaPolicy;
use App\Policies\CostCenterPolicy;
use App\Policies\InvoiceReceiptPolicy;
use App\Policies\ReceiptStatusPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Company::class => CompanyPolicy::class,
        Vendor::class => VendorPolicy::class,
        Stage::class => StagePolicy::class,
        BusinessArea::class => BusinessAreaPolicy::class,
        CostCenter::class => CostCenterPolicy::class,
        InvoiceReceipt::class => InvoiceReceiptPolicy::class,
        ReceiptStatus::class => ReceiptStatusPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}
