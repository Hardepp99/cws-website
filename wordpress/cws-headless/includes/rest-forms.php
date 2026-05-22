<?php

add_action('rest_api_init', function () {
    register_rest_route('cws/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'cws_headless_handle_contact',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('cws/v1', '/enrollment', [
        'methods'             => 'POST',
        'callback'            => 'cws_headless_handle_enrollment',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('cws/v1', '/lead', [
        'methods'             => 'POST',
        'callback'            => 'cws_headless_handle_lead',
        'permission_callback' => '__return_true',
    ]);
});

function cws_headless_sanitize_field(string $value): string
{
    return sanitize_text_field(wp_unslash($value));
}

function cws_headless_handle_contact(WP_REST_Request $request): WP_REST_Response
{
    $name    = cws_headless_sanitize_field($request->get_param('name') ?? '');
    $email   = sanitize_email($request->get_param('email') ?? '');
    $phone   = cws_headless_sanitize_field($request->get_param('phone') ?? '');
    $subject = cws_headless_sanitize_field($request->get_param('subject') ?? '');
    $budget  = cws_headless_sanitize_field($request->get_param('budget') ?? '');
    $message = sanitize_textarea_field($request->get_param('message') ?? '');

    if (!$name || !$email || !$phone || !$subject || !$budget || !$message) {
        return new WP_REST_Response(['success' => false, 'message' => 'All fields are required.'], 400);
    }

    if (!is_email($email)) {
        return new WP_REST_Response(['success' => false, 'message' => 'Invalid email address.'], 400);
    }

    $post_id = wp_insert_post([
        'post_type'   => 'form_submission',
        'post_status' => 'publish',
        'post_title'  => sprintf('Contact: %s — %s', $name, $subject),
    ]);

    if ($post_id && !is_wp_error($post_id)) {
        update_post_meta($post_id, 'form_type', 'contact');
        update_post_meta($post_id, 'name', $name);
        update_post_meta($post_id, 'email', $email);
        update_post_meta($post_id, 'phone', $phone);
        update_post_meta($post_id, 'subject', $subject);
        update_post_meta($post_id, 'budget', $budget);
        update_post_meta($post_id, 'message', $message);
    }

    $to      = get_option('cws_contact_email', 'info@cwsindia.online');
    $headers = ['Content-Type: text/html; charset=UTF-8'];
    $body    = "<p><strong>Name:</strong> {$name}</p><p><strong>Email:</strong> {$email}</p><p><strong>Phone:</strong> {$phone}</p><p><strong>Subject:</strong> {$subject}</p><p><strong>Budget:</strong> {$budget}</p><p><strong>Message:</strong><br>" . nl2br(esc_html($message)) . '</p>';
    wp_mail($to, 'New Contact Form: ' . $subject, $body, $headers);

    return new WP_REST_Response(['success' => true, 'message' => 'Thank you! We will contact you soon.']);
}

function cws_headless_handle_enrollment(WP_REST_Request $request): WP_REST_Response
{
    $name    = cws_headless_sanitize_field($request->get_param('name') ?? '');
    $email   = sanitize_email($request->get_param('email') ?? '');
    $phone   = cws_headless_sanitize_field($request->get_param('phone') ?? '');
    $course  = cws_headless_sanitize_field($request->get_param('course') ?? '');
    $message = sanitize_textarea_field($request->get_param('message') ?? '');

    if (!$name || !$email || !$phone || !$course) {
        return new WP_REST_Response(['success' => false, 'message' => 'Name, email, phone, and course are required.'], 400);
    }

    if (!is_email($email)) {
        return new WP_REST_Response(['success' => false, 'message' => 'Invalid email address.'], 400);
    }

    $post_id = wp_insert_post([
        'post_type'   => 'form_submission',
        'post_status' => 'publish',
        'post_title'  => sprintf('Enrollment: %s — %s', $name, $course),
    ]);

    if ($post_id && !is_wp_error($post_id)) {
        update_post_meta($post_id, 'form_type', 'enrollment');
        update_post_meta($post_id, 'name', $name);
        update_post_meta($post_id, 'email', $email);
        update_post_meta($post_id, 'phone', $phone);
        update_post_meta($post_id, 'course', $course);
        update_post_meta($post_id, 'message', $message);
    }

    $to = get_option('cws_contact_email', 'info@cwsindia.online');
    wp_mail($to, 'Course Enrollment: ' . $course, "<p>{$name} — {$email} — {$phone}</p><p>{$message}</p>", ['Content-Type: text/html; charset=UTF-8']);

    return new WP_REST_Response(['success' => true, 'message' => 'Enrollment request received. We will contact you soon.']);
}

/**
 * Ask price, callback popup, and other lightweight leads — stored as form_submission, emailed.
 */
function cws_headless_handle_lead(WP_REST_Request $request): WP_REST_Response
{
    $source   = cws_headless_sanitize_field($request->get_param('source') ?? 'lead');
    $name     = cws_headless_sanitize_field($request->get_param('name') ?? '');
    $email    = sanitize_email($request->get_param('email') ?? '');
    $phone    = cws_headless_sanitize_field($request->get_param('phone') ?? '');
    $message  = sanitize_textarea_field($request->get_param('message') ?? '');
    $extra       = cws_headless_sanitize_field($request->get_param('service_interest') ?? '');
    $selection_kind = cws_headless_sanitize_field($request->get_param('selection_kind') ?? '');
    $selection_id   = cws_headless_sanitize_field($request->get_param('selection_id') ?? '');
    $budget         = cws_headless_sanitize_field($request->get_param('budget') ?? '');
    $timeline       = cws_headless_sanitize_field($request->get_param('timeline') ?? '');
    $page_url       = esc_url_raw($request->get_param('page_url') ?? '');

    $allowed = ['ask_price', 'callback_popup'];
    if (!in_array($source, $allowed, true)) {
        $source = 'ask_price';
    }

    if ($source === 'callback_popup') {
        if (!$phone || strlen($phone) < 8) {
            return new WP_REST_Response(['success' => false, 'message' => 'Please enter a valid mobile number.'], 400);
        }
    } else {
        if (!$name || !$email || !$phone) {
            return new WP_REST_Response(['success' => false, 'message' => 'Name, email, and phone are required.'], 400);
        }
        if (!is_email($email)) {
            return new WP_REST_Response(['success' => false, 'message' => 'Invalid email address.'], 400);
        }
    }

    $title_prefix = $source === 'ask_price' ? 'Ask price' : ($source === 'callback_popup' ? 'Callback offer' : 'Lead');
    $post_id      = wp_insert_post([
        'post_type'   => 'form_submission',
        'post_status' => 'publish',
        'post_title'  => sprintf('%s: %s — %s', $title_prefix, $name ?: $phone, $phone),
    ]);

    if ($post_id && !is_wp_error($post_id)) {
        update_post_meta($post_id, 'form_type', $source);
        update_post_meta($post_id, 'name', $name);
        update_post_meta($post_id, 'email', $email);
        update_post_meta($post_id, 'phone', $phone);
        update_post_meta($post_id, 'message', $message);
        update_post_meta($post_id, 'service_interest', $extra);
        update_post_meta($post_id, 'selection_kind', $selection_kind);
        update_post_meta($post_id, 'selection_id', $selection_id);
        update_post_meta($post_id, 'budget', $budget);
        update_post_meta($post_id, 'timeline', $timeline);
        update_post_meta($post_id, 'page_url', $page_url);
        update_post_meta($post_id, 'source', $source);
    }

    $primary_to = 'harpreet@cwsindia.online';
    $cc         = get_option('cws_contact_email', 'info@cwsindia.online');
    $headers    = ['Content-Type: text/html; charset=UTF-8'];
    $tos        = array_values(array_unique(array_filter([$primary_to, $cc], 'is_email')));
    $body = '<p><strong>Source:</strong> ' . esc_html($source) . '</p>';
    if ($page_url) {
        $body .= '<p><strong>Page:</strong> ' . esc_html($page_url) . '</p>';
    }
    $body .= '<p><strong>Name:</strong> ' . esc_html($name) . '</p>';
    $body .= '<p><strong>Email:</strong> ' . esc_html($email) . '</p>';
    $body .= '<p><strong>Phone:</strong> ' . esc_html($phone) . '</p>';
    if ($extra) {
        $body .= '<p><strong>Selection:</strong> ' . esc_html($extra) . '</p>';
    }
    if ($budget) {
        $body .= '<p><strong>Budget:</strong> ' . esc_html($budget) . '</p>';
    }
    if ($timeline) {
        $body .= '<p><strong>Timeline:</strong> ' . esc_html($timeline) . '</p>';
    }
    if ($message) {
        $body .= '<p><strong>Message:</strong><br>' . nl2br(esc_html($message)) . '</p>';
    }

    $subject = sprintf('[%s] %s — %s', get_bloginfo('name'), $title_prefix, $phone);
    foreach ($tos as $to) {
        if (is_email($to)) {
            wp_mail($to, $subject, $body, $headers);
        }
    }

    return new WP_REST_Response(['success' => true, 'message' => 'Thank you! Our team will reach out shortly.']);
}
