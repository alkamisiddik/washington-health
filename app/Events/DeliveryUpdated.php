<?php

namespace App\Events;

use App\Models\Delivery;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeliveryUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Delivery $delivery
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('deliveries'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'delivery_id' => $this->delivery->id,
            'status' => $this->delivery->status,
        ];
    }
}
