<?php

namespace App\Console\Commands;

use App\Models\Items;
use Illuminate\Console\Command;

class UpdateItemStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'items:update-status';
    protected $description = 'Update item status based on expiry date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();

        Items::chunk(100, function ($items) use ($now) {
            foreach ($items as $item) {
                $status = 'good';

                if ($item->expiry_date && $item->expiry_date->isPast()) {
                    $status = 'expired';
                } elseif ($item->quantity <= 0) {
                    $status = 'short';
                } elseif ($item->expiry_date && $item->expiry_date->diffInDays($now, false) <= 30) {
                    $status = 'warning';
                }

                if ($item->status !== $status) {
                    $item->status = $status;
                    $item->save(); // will trigger the model event too, but no problem
                }
            }
        });

        $this->info('Item statuses updated successfully.');
    }
}
