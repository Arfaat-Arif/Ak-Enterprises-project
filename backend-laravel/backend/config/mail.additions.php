<?php

// Add this single entry to the array returned by config/mail.php in a
// real Laravel install (config/mail.php already exists after `laravel
// new`; this file is just a reminder of the one key to add — don't
// replace the whole file with this).

return [
    'contact_notification_address' => env('CONTACT_NOTIFICATION_EMAIL'),
];
