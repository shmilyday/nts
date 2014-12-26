<?php

$exist_users = array('admin', 'admina');

$username = '';

if (isset($_GET['username'])) {
    $username = $_GET['username'];
}
echo in_array($username, $exist_users) ? 1 : 0;
?>