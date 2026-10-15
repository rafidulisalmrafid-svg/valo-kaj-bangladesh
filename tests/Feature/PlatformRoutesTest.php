<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed database for realistic tests
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_pages_load_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);

        $response = $this->get('/explore');
        $response->assertStatus(200);

        $response = $this->get('/leaderboard');
        $response->assertStatus(200);

        $response = $this->get('/map');
        $response->assertStatus(200);

        $response = $this->get('/campaigns');
        $response->assertStatus(200);

        $response = $this->get('/auth');
        $response->assertStatus(200);

        $response = $this->get('/verify-certificate');
        $response->assertStatus(200);
    }

    public function test_quick_role_switch_and_authenticated_panels(): void
    {
        // Switch to district moderator
        $response = $this->from('/explore')->get('/auth/switch-role/district_moderator');
        $response->assertRedirect('/explore');
        $this->assertAuthenticated();

        // Access district moderator dashboard
        $response = $this->get('/moderator/district');
        $response->assertStatus(200);

        // Switch to super admin
        $response = $this->from('/explore')->get('/auth/switch-role/super_admin');
        $response->assertRedirect('/explore');

        // Access super admin panel
        $response = $this->get('/admin');
        $response->assertStatus(200);

        // Switch to award committee
        $response = $this->from('/explore')->get('/auth/switch-role/award_committee');
        $response->assertRedirect('/explore');

        // Access award committee panel
        $response = $this->get('/awards/committee');
        $response->assertStatus(200);
    }
}
