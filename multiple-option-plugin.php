<?php
/**
 * Plugin Name: Multiple Option
 * Description: Give Your readers a mutiple choice question.
 * Author: Deepak
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) {
    exit;
}
// Exit if accessed directly

class AreYouPayingAttention
{
    public function __construct()
    {
        add_action('init', array($this, 'adminAssets'));
    }

    public function adminAssets()
    {
        wp_register_style('quizeditcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('multiplechoice/multiple-choice', array(
            'editor_script' => 'ournewblocktype',
            'editor_style' => 'quizeditcss',
            'render_callback' => array($this, 'theHTML'),
        ));
    }

    public function theHTML($attributes)
    {
        if (!is_admin()) {
            wp_enqueue_script('attention-frontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'));
            wp_enqueue_style('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.css');
        }
        ob_start();?>
        <div class="paying-attention-update-me"><pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre></div>
    <?php return ob_get_clean();
    }
}

$areYouPayingAttention = new AreYouPayingAttention();