<?php
/**
 * Plugin Name:         Form to capture leads 
 * Plugin URI:          weddinghub.io
 * Description:         This plugin is used for custom multstep lead form for wedding hub.
 * Version:             1.0.0
 * Author:              Saad Abbasi
 * Author URI:          https://Saadabbasi.dev
 * 
 * 
 */

 function load_ng_scripts() {
    wp_enqueue_style( 'ng_styles', plugin_dir_url( __FILE__ ) . 'dist/wp-angular-form/styles.ef46db3751d8e999.css' );
    wp_register_script( 'ng_main', plugin_dir_url( __FILE__ ) . 'dist/wp-angular-form/main.2d7105ebec42dec0.js', true );
    wp_register_script( 'ng_polyfills', plugin_dir_url( __FILE__ ) . 'dist/wp-angular-form/polyfills.2fcbda6236c1616e.js', true );
    wp_register_script( 'ng_runtime', plugin_dir_url( __FILE__ ) . 'dist/wp-angular-form/runtime.4ddd9df43c06ec25.js', true );
}

add_action( 'wp_enqueue_scripts', 'load_ng_scripts' );


function attach_ng() {
    wp_enqueue_script( 'ng_main' );
    wp_enqueue_script( 'ng_polyfills' );
    wp_enqueue_script( 'ng_runtime' );

    return "<app-root></app-root>";
}

add_shortcode( 'ng_wp_form', 'attach_ng' );


?>