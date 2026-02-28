<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeliveryStatusUpdatedNotification extends Notification
{
    use Queueable;

    protected $delivery;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($delivery)
    {
        $this->delivery = $delivery;
        $this->status = str_replace('_', ' ', $delivery->status);
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
            ->subject("Delivery #{$this->delivery->id} Status Update")
            ->line("The status of delivery #{$this->delivery->id} has been updated to: " . strtoupper($this->status))
            ->action('View Delivery Details', url('/officer/deliveries/' . $this->delivery->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'delivery_id' => $this->delivery->id,
            'title' => 'Delivery Status Updated',
            'message' => "Delivery #{$this->delivery->id} is now " . strtoupper($this->status),
            'type' => 'status_updated',
            'action_url' => "/officer/deliveries/{$this->delivery->id}",
        ];
    }
}
