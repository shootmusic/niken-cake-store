<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = 'orders-data.json';

// Handle GET request - Ambil semua orders
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        echo json_encode([]);
    }
    exit;
}

// Handle POST request - Simpan order baru
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }
    
    // Baca data existing
    $existingData = [];
    if (file_exists($dataFile)) {
        $existingData = json_decode(file_get_contents($dataFile), true);
        if (!is_array($existingData)) {
            $existingData = [];
        }
    }
    
    // Generate ID jika belum ada
    if (!isset($input['id'])) {
        $input['id'] = time() . rand(1000, 9999);
    }
    
    // Tambah timestamp jika belum ada
    if (!isset($input['timestamp'])) {
        $input['timestamp'] = date('c');
    }
    
    // Tambah status jika belum ada
    if (!isset($input['status'])) {
        $input['status'] = 'Menunggu Pembayaran';
    }
    
    // Tambah order ke array
    $existingData[] = $input;
    
    // Simpan ke file
    if (file_put_contents($dataFile, json_encode($existingData, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'order_id' => $input['id'], 'message' => 'Order saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save order']);
    }
    exit;
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>