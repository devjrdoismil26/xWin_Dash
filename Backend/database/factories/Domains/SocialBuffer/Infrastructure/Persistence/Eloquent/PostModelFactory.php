<?php

namespace Database\Factories\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent;

use App\Domains\SocialBuffer\Infrastructure\Persistence\Eloquent\PostModel;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostModelFactory extends Factory
{
    protected $model = PostModel::class;

    public function definition(): array
    {
        $platforms = [
            'facebook',
            'twitter',
            'instagram',
            'linkedin',
            'youtube',
            'tiktok',
            'pinterest',
            'snapchat',
            'telegram',
            'discord',
            'reddit',
            'mastodon',
            'threads',
            'bluesky'
        ];

        $statuses = [
            'draft',
            'scheduled',
            'published',
            'failed',
            'cancelled',
            'processing'
        ];

        $platform = $this->faker->randomElement($platforms);
        $status = $this->faker->randomElement($statuses);
        $isScheduled = $status === 'scheduled';
        $isPublished = $status === 'published';

        return [
            'user_id' => $this->faker->uuid(),
            'content' => $this->generateContent($platform),
            'status' => $status,
            'scheduled_at' => $isScheduled ? $this->faker->dateTimeBetween('+1 hour', '+30 days') : null,
            'published_at' => $isPublished ? $this->faker->dateTimeBetween('-30 days', 'now') : null,
            'platform_post_id' => $isPublished ? $this->generatePlatformPostId($platform) : null,
            'platform' => $platform,
            'post_url' => $isPublished ? $this->generatePostUrl($platform) : null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'scheduled_at' => null,
            'published_at' => null,
            'platform_post_id' => null,
            'post_url' => null,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => $this->faker->dateTimeBetween('+1 hour', '+30 days'),
            'published_at' => null,
            'platform_post_id' => null,
            'post_url' => null,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'scheduled_at' => $this->faker->dateTimeBetween('-30 days', '-1 hour'),
            'published_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'platform_post_id' => $this->generatePlatformPostId($attributes['platform'] ?? 'facebook'),
            'post_url' => $this->generatePostUrl($attributes['platform'] ?? 'facebook'),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'scheduled_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'published_at' => null,
            'platform_post_id' => null,
            'post_url' => null,
        ]);
    }

    public function facebook(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'facebook',
            'content' => $this->generateFacebookContent(),
        ]);
    }

    public function twitter(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'twitter',
            'content' => $this->generateTwitterContent(),
        ]);
    }

    public function instagram(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'instagram',
            'content' => $this->generateInstagramContent(),
        ]);
    }

    public function linkedin(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'linkedin',
            'content' => $this->generateLinkedInContent(),
        ]);
    }

    public function youtube(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'youtube',
            'content' => $this->generateYouTubeContent(),
        ]);
    }

    public function tiktok(): static
    {
        return $this->state(fn (array $attributes) => [
            'platform' => 'tiktok',
            'content' => $this->generateTikTokContent(),
        ]);
    }

    private function generateContent(string $platform): string
    {
        $contentGenerators = [
            'facebook' => [$this, 'generateFacebookContent'],
            'twitter' => [$this, 'generateTwitterContent'],
            'instagram' => [$this, 'generateInstagramContent'],
            'linkedin' => [$this, 'generateLinkedInContent'],
            'youtube' => [$this, 'generateYouTubeContent'],
            'tiktok' => [$this, 'generateTikTokContent'],
            'pinterest' => [$this, 'generatePinterestContent'],
            'snapchat' => [$this, 'generateSnapchatContent'],
            'telegram' => [$this, 'generateTelegramContent'],
            'discord' => [$this, 'generateDiscordContent'],
            'reddit' => [$this, 'generateRedditContent'],
            'mastodon' => [$this, 'generateMastodonContent'],
            'threads' => [$this, 'generateThreadsContent'],
            'bluesky' => [$this, 'generateBlueskyContent']
        ];

        $generator = $contentGenerators[$platform] ?? [$this, 'generateGenericContent'];
        return $generator();
    }

    private function generateFacebookContent(): string
    {
        $templates = [
            "Just had an amazing experience! {emoji} {hashtag}",
            "Sharing some thoughts on {topic} today. What do you think? {hashtag}",
            "Excited to announce {announcement}! {emoji} {hashtag}",
            "Behind the scenes: {behind_scenes} {emoji} {hashtag}",
            "Thank you for all the support! {emoji} {hashtag}",
            "Quick update: {update} {emoji} {hashtag}",
            "Feeling grateful for {grateful_for} today! {emoji} {hashtag}",
            "New project alert! {project_details} {emoji} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generateTwitterContent(): string
    {
        $templates = [
            "{thought} {hashtag}",
            "Hot take: {hot_take} {hashtag}",
            "Thread: {thread_start} {hashtag}",
            "Just learned: {learning} {hashtag}",
            "Question: {question} {hashtag}",
            "Update: {update} {hashtag}",
            "Sharing: {share} {hashtag}",
            "Quick thought: {quick_thought} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generateInstagramContent(): string
    {
        $templates = [
            "{emoji} {caption} {hashtag}",
            "Behind the scenes {emoji} {hashtag}",
            "New post alert! {emoji} {hashtag}",
            "Feeling {feeling} today {emoji} {hashtag}",
            "Throwback to {throwback} {emoji} {hashtag}",
            "Currently {currently} {emoji} {hashtag}",
            "Just {just_did} {emoji} {hashtag}",
            "Love this {love_this} {emoji} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generateLinkedInContent(): string
    {
        $templates = [
            "Professional insight: {insight} {hashtag}",
            "Industry update: {update} {hashtag}",
            "Career tip: {tip} {hashtag}",
            "Networking thought: {thought} {hashtag}",
            "Business update: {update} {hashtag}",
            "Leadership lesson: {lesson} {hashtag}",
            "Market observation: {observation} {hashtag}",
            "Professional milestone: {milestone} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generateYouTubeContent(): string
    {
        $templates = [
            "New video: {video_title} {emoji} {hashtag}",
            "Tutorial: {tutorial_topic} {emoji} {hashtag}",
            "Review: {review_item} {emoji} {hashtag}",
            "Behind the scenes: {behind_scenes} {emoji} {hashtag}",
            "Live stream: {stream_topic} {emoji} {hashtag}",
            "Collaboration: {collaboration} {emoji} {hashtag}",
            "Challenge: {challenge} {emoji} {hashtag}",
            "Q&A: {qa_topic} {emoji} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generateTikTokContent(): string
    {
        $templates = [
            "{emoji} {trend} {hashtag}",
            "POV: {pov} {hashtag}",
            "Day in my life: {day_activity} {hashtag}",
            "Try this: {try_this} {hashtag}",
            "Story time: {story} {hashtag}",
            "Dance: {dance} {hashtag}",
            "Comedy: {comedy} {hashtag}",
            "Life hack: {hack} {hashtag}"
        ];

        return $this->fillTemplate($this->faker->randomElement($templates));
    }

    private function generatePinterestContent(): string
    {
        return $this->fillTemplate("Pin: {pin_idea} {emoji} {hashtag}");
    }

    private function generateSnapchatContent(): string
    {
        return $this->fillTemplate("Snap: {snap_content} {emoji}");
    }

    private function generateTelegramContent(): string
    {
        return $this->fillTemplate("Update: {update} {emoji}");
    }

    private function generateDiscordContent(): string
    {
        return $this->fillTemplate("Server update: {update} {emoji}");
    }

    private function generateRedditContent(): string
    {
        return $this->fillTemplate("TIL: {til} {hashtag}");
    }

    private function generateMastodonContent(): string
    {
        return $this->fillTemplate("Toot: {toot} {hashtag}");
    }

    private function generateThreadsContent(): string
    {
        return $this->fillTemplate("Thread: {thread} {hashtag}");
    }

    private function generateBlueskyContent(): string
    {
        return $this->fillTemplate("Skeet: {skeet} {hashtag}");
    }

    private function generateGenericContent(): string
    {
        return $this->fillTemplate("Post: {content} {emoji} {hashtag}");
    }

    private function fillTemplate(string $template): string
    {
        $replacements = [
            '{emoji}' => $this->faker->randomElement(['😊', '🚀', '💡', '🎉', '🔥', '⭐', '💪', '🎯', '🌟', '❤️']),
            '{hashtag}' => '#' . $this->faker->word(),
            '{thought}' => $this->faker->sentence(),
            '{hot_take}' => $this->faker->sentence(),
            '{thread_start}' => $this->faker->sentence(),
            '{learning}' => $this->faker->sentence(),
            '{question}' => $this->faker->sentence() . '?',
            '{update}' => $this->faker->sentence(),
            '{share}' => $this->faker->sentence(),
            '{quick_thought}' => $this->faker->sentence(),
            '{caption}' => $this->faker->sentence(),
            '{feeling}' => $this->faker->randomElement(['grateful', 'excited', 'motivated', 'inspired', 'happy', 'proud']),
            '{throwback}' => $this->faker->sentence(),
            '{currently}' => $this->faker->randomElement(['working on', 'learning', 'exploring', 'building', 'creating']),
            '{just_did}' => $this->faker->randomElement(['finished', 'started', 'discovered', 'achieved', 'completed']),
            '{love_this}' => $this->faker->randomElement(['moment', 'view', 'experience', 'product', 'idea']),
            '{insight}' => $this->faker->sentence(),
            '{tip}' => $this->faker->sentence(),
            '{lesson}' => $this->faker->sentence(),
            '{observation}' => $this->faker->sentence(),
            '{milestone}' => $this->faker->sentence(),
            '{video_title}' => $this->faker->sentence(),
            '{tutorial_topic}' => $this->faker->sentence(),
            '{review_item}' => $this->faker->sentence(),
            '{behind_scenes}' => $this->faker->sentence(),
            '{stream_topic}' => $this->faker->sentence(),
            '{collaboration}' => $this->faker->sentence(),
            '{challenge}' => $this->faker->sentence(),
            '{qa_topic}' => $this->faker->sentence(),
            '{trend}' => $this->faker->sentence(),
            '{pov}' => $this->faker->sentence(),
            '{day_activity}' => $this->faker->sentence(),
            '{try_this}' => $this->faker->sentence(),
            '{story}' => $this->faker->sentence(),
            '{dance}' => $this->faker->sentence(),
            '{comedy}' => $this->faker->sentence(),
            '{hack}' => $this->faker->sentence(),
            '{pin_idea}' => $this->faker->sentence(),
            '{snap_content}' => $this->faker->sentence(),
            '{til}' => $this->faker->sentence(),
            '{toot}' => $this->faker->sentence(),
            '{thread}' => $this->faker->sentence(),
            '{skeet}' => $this->faker->sentence(),
            '{content}' => $this->faker->sentence(),
            '{topic}' => $this->faker->word(),
            '{announcement}' => $this->faker->sentence(),
            '{grateful_for}' => $this->faker->sentence(),
            '{project_details}' => $this->faker->sentence()
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $template);
    }

    private function generatePlatformPostId(string $platform): string
    {
        $patterns = [
            'facebook' => $this->faker->numberBetween(100000000000000, 999999999999999),
            'twitter' => $this->faker->numberBetween(1000000000000000000, 9999999999999999999),
            'instagram' => $this->faker->regexify('[A-Za-z0-9]{11}'),
            'linkedin' => $this->faker->numberBetween(1000000000000000, 9999999999999999),
            'youtube' => $this->faker->regexify('[A-Za-z0-9_-]{11}'),
            'tiktok' => $this->faker->numberBetween(1000000000000000000, 9999999999999999999),
            'pinterest' => $this->faker->regexify('[A-Za-z0-9]{10}'),
            'snapchat' => $this->faker->regexify('[A-Za-z0-9]{20}'),
            'telegram' => $this->faker->numberBetween(100000000, 999999999),
            'discord' => $this->faker->numberBetween(100000000000000000, 999999999999999999),
            'reddit' => $this->faker->regexify('[A-Za-z0-9]{6}'),
            'mastodon' => $this->faker->numberBetween(100000000000000000, 999999999999999999),
            'threads' => $this->faker->numberBetween(1000000000000000000, 9999999999999999999),
            'bluesky' => $this->faker->regexify('[A-Za-z0-9]{20}')
        ];

        return (string) ($patterns[$platform] ?? $this->faker->uuid());
    }

    private function generatePostUrl(string $platform): string
    {
        $baseUrls = [
            'facebook' => 'https://facebook.com/posts/',
            'twitter' => 'https://twitter.com/user/status/',
            'instagram' => 'https://instagram.com/p/',
            'linkedin' => 'https://linkedin.com/posts/',
            'youtube' => 'https://youtube.com/watch?v=',
            'tiktok' => 'https://tiktok.com/@user/video/',
            'pinterest' => 'https://pinterest.com/pin/',
            'snapchat' => 'https://snapchat.com/story/',
            'telegram' => 'https://t.me/channel/',
            'discord' => 'https://discord.com/channels/',
            'reddit' => 'https://reddit.com/r/subreddit/comments/',
            'mastodon' => 'https://mastodon.social/@user/',
            'threads' => 'https://threads.net/@user/post/',
            'bluesky' => 'https://bsky.app/profile/user/post/'
        ];

        $baseUrl = $baseUrls[$platform] ?? 'https://example.com/post/';
        $postId = $this->generatePlatformPostId($platform);

        return $baseUrl . $postId;
    }
}