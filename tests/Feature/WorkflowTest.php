<?php

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Delivery;

it('registers a user automatically as a driver', function () {
    $response = $this->post('/register', [
        'name' => 'Test Driver',
        'email' => 'driver@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/');
    
    $user = User::where('email', 'driver@example.com')->first();
    expect($user->role)->toBe('driver');
});

it('allows admin to login and verify roles', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    
    $response = $this->actingAs($admin)->get('/admin/users');
    $response->assertStatus(200);
});

it('allows admin to change user roles', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'driver']);
    
    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/role", [
        'role' => 'officer'
    ]);
    
    $response->assertSessionHasNoErrors();
    expect($user->fresh()->role)->toBe('officer');
});

it('allows officer to create a delivery', function () {
    $officer = User::factory()->create(['role' => 'officer']);
    
    $response = $this->actingAs($officer)->post('/officer/deliveries', [
        'pickup_location' => 'Hospital A',
        'delivery_location' => 'Lab B',
        'scheduled_time' => now()->addHours(2)->toDateTimeString(),
        'notes' => 'Test tracking',
    ]);

    $delivery = Delivery::latest()->first();
    
    expect($delivery->requested_by)->toBe($officer->id);
    expect($delivery->status)->toBe('pending');
});

it('verifies the full delivery flow', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $officer = User::factory()->create(['role' => 'officer']);
    $driver = User::factory()->create(['role' => 'driver']);
    $vehicle = Vehicle::create(['vehicle_number' => 'V-999', 'description' => 'Test Van', 'status' => 'active']);
    
    // Officer creates
    $delivery = Delivery::create([
        'pickup_location' => 'Pickup',
        'delivery_location' => 'Dropoff',
        'scheduled_time' => now()->addDay(),
        'requested_by' => $officer->id,
        'status' => 'pending'
    ]);
    
    // Officer assigns driver
    $response = $this->actingAs($officer)->post("/officer/deliveries/{$delivery->id}/assign", [
        'driver_id' => $driver->id,
        'vehicle_id' => $vehicle->id,
    ]);
    
    expect($delivery->fresh()->status)->toBe('assigned');
    expect($delivery->fresh()->driver_id)->toBe($driver->id);
    
    // Driver starts
    $response = $this->actingAs($driver)->post("/driver/deliveries/{$delivery->id}/start");
    expect($delivery->fresh()->status)->toBe('in_progress');
    
    // Driver submits CoC
    $response = $this->actingAs($driver)->post("/deliveries/{$delivery->id}/chain-of-custody", [
        'container_ids' => 'C-123',
        'condition' => 'Intact',
        'pickup_department' => 'Pathology',
        'delivery_department' => 'Genetics',
        'driver_signature' => 'data:image/png;base64,123',
        'receiver_signature' => 'data:image/png;base64,456',
        'is_final' => true,
    ]);
    
    // Driver ends
    $response = $this->actingAs($driver)->post("/driver/deliveries/{$delivery->id}/end");
    expect($delivery->fresh()->status)->toBe('completed');
    
    // Validate Admin can see them
    $response = $this->actingAs($admin)->get("/admin/deliveries/{$delivery->id}");
    $response->assertStatus(200);
});
