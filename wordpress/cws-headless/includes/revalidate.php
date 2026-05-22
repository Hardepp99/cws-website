<?php

add_action('save_post', 'cws_headless_trigger_revalidate', 20, 3);

function cws_headless_trigger_revalidate(int $post_id, $post, bool $update): void
{
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    if (!in_array($post->post_type, ['page', 'post', 'service_landing', 'service', 'course', 'portfolio_item'], true)) {
        return;
    }

    $next_url = getenv('CWS_NEXT_REVALIDATE_URL') ?: get_option('cws_next_revalidate_url', 'http://localhost:3000/api/revalidate');
    $secret   = getenv('CWS_REVALIDATE_SECRET') ?: get_option('cws_revalidate_secret', '');

    if (!$secret) {
        return;
    }

    $paths = ['/'];
    if ($post->post_name) {
        $paths[] = '/' . $post->post_name;
    }

    wp_remote_post($next_url, [
        'timeout' => 5,
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode([
            'secret' => $secret,
            'paths'  => $paths,
            'slug'   => $post->post_name,
            'type'   => $post->post_type,
        ]),
    ]);
}

add_action('admin_init', function () {
    register_setting('cws_headless', 'cws_next_revalidate_url');
    register_setting('cws_headless', 'cws_revalidate_secret');
});

add_action('admin_menu', function () {
    add_options_page('CWS Headless', 'CWS Headless', 'manage_options', 'cws-headless', function () {
        ?>
        <div class="wrap">
            <h1>CWS Headless Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('cws_headless'); ?>
                <table class="form-table">
                    <tr>
                        <th><label for="cws_next_revalidate_url">Next.js Revalidate URL</label></th>
                        <td><input type="url" class="regular-text" name="cws_next_revalidate_url" id="cws_next_revalidate_url" value="<?php echo esc_attr(get_option('cws_next_revalidate_url', 'http://localhost:3000/api/revalidate')); ?>"></td>
                    </tr>
                    <tr>
                        <th><label for="cws_revalidate_secret">Revalidate Secret</label></th>
                        <td><input type="text" class="regular-text" name="cws_revalidate_secret" id="cws_revalidate_secret" value="<?php echo esc_attr(get_option('cws_revalidate_secret', '')); ?>"></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    });
});
