<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; color: #1c222b;">
    <h2>New inquiry received</h2>
    <p><strong>Name:</strong> {{ $inquiry->name }}</p>
    <p><strong>Email:</strong> {{ $inquiry->email }}</p>
    @if($inquiry->phone)
        <p><strong>Phone:</strong> {{ $inquiry->phone }}</p>
    @endif
    @if($inquiry->company)
        <p><strong>Company:</strong> {{ $inquiry->company }}</p>
    @endif
    @if($inquiry->product)
        <p><strong>Regarding product:</strong> {{ $inquiry->product->name }} ({{ $inquiry->product->sku }})</p>
    @endif
    <p><strong>Message:</strong></p>
    <p>{{ $inquiry->message }}</p>
</body>
</html>
