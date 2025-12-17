<?php

namespace Database\Factories\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailCampaignModelFactory extends Factory
{
    protected $model = EmailCampaignModel::class;

    public function definition(): array
    {
        $statuses = [
            'draft',
            'scheduled',
            'sending',
            'sent',
            'paused',
            'cancelled',
            'failed'
        ];

        $status = $this->faker->randomElement($statuses);
        $isScheduled = $status === 'scheduled';
        $isSent = $status === 'sent';

        return [
            'name' => $this->generateCampaignName(),
            'description' => $this->faker->sentence(),
            'subject' => $this->generateEmailSubject(),
            'preview_text' => $this->faker->sentence(),
            'from_name' => $this->faker->name(),
            'from_email' => $this->faker->email(),
            'reply_to' => $this->faker->email(),
            'html_content' => $this->generateEmailContent(),
            'text_content' => $this->faker->paragraphs(3, true),
            'type' => $this->faker->randomElement(['newsletter', 'promotional', 'transactional', 'announcement']),
            'status' => $status,
            'scheduled_at' => $isScheduled ? $this->faker->dateTimeBetween('+1 hour', '+30 days') : null,
            'sent_at' => $isSent ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'recipients_count' => $this->faker->numberBetween(100, 10000),
            'sent_count' => $isSent ? $this->faker->numberBetween(100, 10000) : 0,
            'delivered_count' => $isSent ? $this->faker->numberBetween(90, 10000) : 0,
            'opened_count' => $isSent ? $this->faker->numberBetween(20, 5000) : 0,
            'clicked_count' => $isSent ? $this->faker->numberBetween(5, 1000) : 0,
            'bounced_count' => $isSent ? $this->faker->numberBetween(0, 100) : 0,
            'unsubscribed_count' => $isSent ? $this->faker->numberBetween(0, 50) : 0,
            'open_rate' => $isSent ? $this->faker->randomFloat(2, 10, 50) : 0,
            'click_rate' => $isSent ? $this->faker->randomFloat(2, 1, 10) : 0,
            'bounce_rate' => $isSent ? $this->faker->randomFloat(2, 0, 5) : 0,
            'settings' => [
                'track_opens' => true,
                'track_clicks' => true,
                'unsubscribe_link' => true,
                'social_sharing' => $this->faker->boolean(),
                'auto_responder' => $this->faker->boolean(),
            ],
            'project_id' => $this->faker->uuid(),
            'created_by' => $this->faker->uuid(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'scheduled_at' => null,
            'sent_at' => null,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => $this->faker->dateTimeBetween('+1 hour', '+30 days'),
            'sent_at' => null,
        ]);
    }

    public function sending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sending',
            'scheduled_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
            'sent_at' => null,
        ]);
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'scheduled_at' => $this->faker->dateTimeBetween('-30 days', '-1 hour'),
            'sent_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }

    public function paused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paused',
            'scheduled_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'sent_at' => null,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'scheduled_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'sent_at' => null,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'scheduled_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'sent_at' => null,
        ]);
    }

    public function newsletter(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->randomElement([
                'Weekly Newsletter',
                'Monthly Update',
                'Product News',
                'Company Updates',
                'Industry Insights'
            ]),
            'subject' => $this->faker->randomElement([
                'Your Weekly Newsletter is Here!',
                'Monthly Update: What\'s New',
                'Product News & Updates',
                'Company Highlights',
                'Industry Insights & Trends'
            ]),
            'html_content' => $this->generateNewsletterContent(),
        ]);
    }

    public function promotional(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->randomElement([
                'Black Friday Sale',
                'Summer Promotion',
                'New Product Launch',
                'Limited Time Offer',
                'Holiday Special'
            ]),
            'subject' => $this->faker->randomElement([
                '🔥 Black Friday Sale - 50% Off Everything!',
                '☀️ Summer Promotion - Don\'t Miss Out!',
                '🚀 New Product Launch - Get Yours Today!',
                '⏰ Limited Time Offer - Act Fast!',
                '🎉 Holiday Special - Exclusive Deals!'
            ]),
            'html_content' => $this->generatePromotionalContent(),
        ]);
    }

    public function transactional(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->randomElement([
                'Welcome Email',
                'Order Confirmation',
                'Password Reset',
                'Account Verification',
                'Payment Receipt'
            ]),
            'subject' => $this->faker->randomElement([
                'Welcome to Our Platform!',
                'Order Confirmation #' . $this->faker->numberBetween(1000, 9999),
                'Reset Your Password',
                'Verify Your Account',
                'Payment Receipt'
            ]),
            'html_content' => $this->generateTransactionalContent(),
        ]);
    }

    private function generateCampaignName(): string
    {
        $templates = [
            '{type} Campaign - {month} {year}',
            '{type} Email - {theme}',
            '{type} Newsletter - {date}',
            '{type} Update - {topic}',
            '{type} Promotion - {product}',
            '{type} Announcement - {event}',
            '{type} Reminder - {action}',
            '{type} Invitation - {event}'
        ];

        $template = $this->faker->randomElement($templates);
        
        $replacements = [
            '{type}' => $this->faker->randomElement(['Newsletter', 'Promotional', 'Transactional', 'Announcement', 'Update', 'Reminder']),
            '{month}' => $this->faker->monthName(),
            '{year}' => $this->faker->year(),
            '{theme}' => $this->faker->randomElement(['Summer', 'Winter', 'Spring', 'Fall', 'Holiday', 'Back to School']),
            '{date}' => $this->faker->date('M d, Y'),
            '{topic}' => $this->faker->randomElement(['Product Updates', 'Company News', 'Industry Trends', 'User Stories']),
            '{product}' => $this->faker->randomElement(['Premium Plan', 'New Feature', 'Mobile App', 'Web Platform']),
            '{event}' => $this->faker->randomElement(['Webinar', 'Conference', 'Workshop', 'Launch Party']),
            '{action}' => $this->faker->randomElement(['Complete Profile', 'Update Settings', 'Renew Subscription', 'Download App'])
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    private function generateEmailSubject(): string
    {
        $templates = [
            '{greeting} {topic}',
            '{action} {product}',
            '{announcement} {emoji}',
            '{reminder} {deadline}',
            '{update} {status}',
            '{invitation} {event}',
            '{offer} {discount}',
            '{news} {highlight}'
        ];

        $template = $this->faker->randomElement($templates);
        
        $replacements = [
            '{greeting}' => $this->faker->randomElement(['Hello', 'Hi', 'Hey', 'Dear']),
            '{topic}' => $this->faker->randomElement(['Weekly Update', 'Product News', 'Company Highlights', 'Industry Insights']),
            '{action}' => $this->faker->randomElement(['Check out', 'Discover', 'Explore', 'Try']),
            '{product}' => $this->faker->randomElement(['our new feature', 'the latest update', 'this amazing product', 'our premium plan']),
            '{announcement}' => $this->faker->randomElement(['Big News', 'Exciting Update', 'Important Announcement', 'Special Offer']),
            '{emoji}' => $this->faker->randomElement(['🚀', '🎉', '🔥', '⭐', '💡', '🎯']),
            '{reminder}' => $this->faker->randomElement(['Don\'t forget', 'Reminder', 'Last chance', 'Final call']),
            '{deadline}' => $this->faker->randomElement(['today', 'this week', 'this month', 'soon']),
            '{update}' => $this->faker->randomElement(['Status Update', 'Progress Report', 'Latest News', 'Recent Changes']),
            '{status}' => $this->faker->randomElement(['on your order', 'about your account', 'regarding your request', 'on your subscription']),
            '{invitation}' => $this->faker->randomElement(['You\'re invited', 'Join us', 'Come along', 'Be part of']),
            '{event}' => $this->faker->randomElement(['our webinar', 'the conference', 'the workshop', 'the launch party']),
            '{offer}' => $this->faker->randomElement(['Special Offer', 'Limited Deal', 'Exclusive Discount', 'Amazing Price']),
            '{discount}' => $this->faker->randomElement(['50% Off', 'Buy 1 Get 1', 'Free Shipping', 'Extra 20%']),
            '{news}' => $this->faker->randomElement(['Breaking News', 'Latest Updates', 'What\'s New', 'Recent Developments']),
            '{highlight}' => $this->faker->randomElement(['This Week', 'This Month', 'This Quarter', 'This Year'])
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    private function generateEmailContent(): string
    {
        $contentTypes = [
            'newsletter' => $this->generateNewsletterContent(),
            'promotional' => $this->generatePromotionalContent(),
            'transactional' => $this->generateTransactionalContent(),
            'announcement' => $this->generateAnnouncementContent(),
            'update' => $this->generateUpdateContent()
        ];

        return $this->faker->randomElement($contentTypes);
    }

    private function generateNewsletterContent(): string
    {
        return "
            <h1>Welcome to Our Newsletter!</h1>
            <p>Thank you for subscribing to our newsletter. Here's what's happening this week:</p>
            
            <h2>Featured Article</h2>
            <p>{$this->faker->paragraph()}</p>
            
            <h2>Product Updates</h2>
            <p>{$this->faker->paragraph()}</p>
            
            <h2>Industry News</h2>
            <p>{$this->faker->paragraph()}</p>
            
            <p>Best regards,<br>The Team</p>
        ";
    }

    private function generatePromotionalContent(): string
    {
        return "
            <h1>Special Offer Just for You!</h1>
            <p>Don't miss out on this amazing opportunity:</p>
            
            <div style='background-color: #f0f0f0; padding: 20px; text-align: center;'>
                <h2 style='color: #e74c3c;'>{$this->faker->randomElement(['50% OFF', 'BUY 1 GET 1 FREE', 'FREE SHIPPING', 'EXTRA 20% OFF'])}</h2>
                <p>{$this->faker->sentence()}</p>
                <a href='#' style='background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Shop Now</a>
            </div>
            
            <p>This offer expires soon, so act fast!</p>
            
            <p>Happy Shopping!<br>The Team</p>
        ";
    }

    private function generateTransactionalContent(): string
    {
        return "
            <h1>Order Confirmation</h1>
            <p>Thank you for your order! Here are the details:</p>
            
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='border: 1px solid #ddd; padding: 8px;'><strong>Order Number:</strong></td>
                    <td style='border: 1px solid #ddd; padding: 8px;'>#{$this->faker->numberBetween(1000, 9999)}</td>
                </tr>
                <tr>
                    <td style='border: 1px solid #ddd; padding: 8px;'><strong>Date:</strong></td>
                    <td style='border: 1px solid #ddd; padding: 8px;'>{$this->faker->date()}</td>
                </tr>
                <tr>
                    <td style='border: 1px solid #ddd; padding: 8px;'><strong>Total:</strong></td>
                    <td style='border: 1px solid #ddd; padding: 8px;'>$" . $this->faker->randomFloat(2, 10, 500) . "</td>
                </tr>
            </table>
            
            <p>We'll send you a shipping confirmation once your order is on its way.</p>
            
            <p>Thank you for your business!<br>The Team</p>
        ";
    }

    private function generateAnnouncementContent(): string
    {
        return "
            <h1>Important Announcement</h1>
            <p>We have some exciting news to share with you:</p>
            
            <div style='background-color: #e8f5e8; padding: 20px; border-left: 4px solid #27ae60;'>
                <h2>{$this->faker->sentence(4)}</h2>
                <p>{$this->faker->paragraph()}</p>
            </div>
            
            <p>We're excited about this development and can't wait to share more details with you soon.</p>
            
            <p>Best regards,<br>The Team</p>
        ";
    }

    private function generateUpdateContent(): string
    {
        return "
            <h1>Update on Your Account</h1>
            <p>Here's what's new with your account:</p>
            
            <ul>
                <li>{$this->faker->sentence()}</li>
                <li>{$this->faker->sentence()}</li>
                <li>{$this->faker->sentence()}</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Thank you,<br>The Team</p>
        ";
    }
}