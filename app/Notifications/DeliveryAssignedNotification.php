<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryAssignedNotification extends Notification
{
    use Queueable;

    protected $delivery;

    /**
     * Create a new notification instance.
     */
    public function __construct($delivery)
    {
        $this->delivery = $delivery;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Delivery Assigned')
            ->line('A new delivery has been assigned to you.')
            ->line('Pickup: ' . $this->delivery->pickup_location)
            ->line('Delivery: ' . $this->delivery->delivery_location)
            ->action('View Delivery', url('/driver/deliveries/' . $this->delivery->id))
            ->line('Thank you for your service!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $url = route('driver.deliveries.show', ['delivery' => $this->delivery->id]);

        return [
            'delivery_id' => $this->delivery->id,
            'title' => 'New Delivery Assigned',
            'message' => "You have been assigned a new delivery from {$this->delivery->pickup_location} to {$this->delivery->delivery_location}.",
            'type' => 'delivery_assigned',
            'action_url' => $url,
        ];
    }
}
