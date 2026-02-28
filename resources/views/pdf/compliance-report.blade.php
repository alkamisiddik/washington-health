<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Compliance Report - {{ $delivery->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0 0 5px 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            color: #666;
        }
        .section-title {
            background-color: #f3f4f6;
            padding: 5px 10px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
            border-left: 4px solid #2563eb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            padding: 8px;
            border: 1px solid #e5e7eb;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
            width: 30%;
        }
        .out-of-range {
            background-color: #fee2e2;
            color: #b91c1c;
        }
        .signature-box {
            border: 1px solid #d1d5db;
            padding: 10px;
            height: 100px;
            margin-top: 5px;
            text-align: center;
        }
        .signature-box img {
            max-height: 80px;
            max-width: 100%;
        }
        .page-break {
            page-break-after: always;
        }
        .checklist-item {
            margin-bottom: 5px;
        }
        .check-mark {
            color: #16a34a;
            font-weight: bold;
        }
        .cross-mark {
            color: #dc2626;
            font-weight: bold;
        }
        .grid-container {
            width: 100%;
        }
        .grid-col {
            display: inline-block;
            width: 48%;
            vertical-align: top;
        }
    </style>
</head>
<body>

    <!-- PAGE 1: Delivery Summary -->
    <div class="header">
        <h1>Washington Health</h1>
        <p>Official Delivery Compliance Report</p>
    </div>

    <div class="section-title">Delivery Information</div>
    <table>
        <tr>
            <th>Delivery ID</th>
            <td>#{{ $delivery->id }}</td>
        </tr>
        <tr>
            <th>Date Scheduled</th>
            <td>{{ \Carbon\Carbon::parse($delivery->scheduled_time)->format('M d, Y H:i A') }}</td>
        </tr>
        <tr>
            <th>Final Status</th>
            <td><strong>{{ strtoupper(str_replace('_', ' ', $delivery->status)) }}</strong></td>
        </tr>
        <tr>
            <th>Duration</th>
            <td>{{ $delivery->duration_minutes ? $delivery->duration_minutes . ' minutes' : 'N/A' }}</td>
        </tr>
    </table>

    <div class="section-title">Personnel & Route</div>
    <table>
        <tr>
            <th>Requested By (Officer)</th>
            <td>{{ $delivery->officer->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Assigned Driver</th>
            <td>{{ $delivery->driver->name ?? 'Unassigned' }}</td>
        </tr>
        <tr>
            <th>Vehicle</th>
            <td>{{ $delivery->vehicle->vehicle_number ?? 'Unassigned' }}</td>
        </tr>
        <tr>
            <th>Pickup Location</th>
            <td>{{ $delivery->pickup_location }}</td>
        </tr>
        <tr>
            <th>Delivery Location</th>
            <td>{{ $delivery->delivery_location }}</td>
        </tr>
        <tr>
            <th>Pickup Time</th>
            <td>{{ $delivery->pickup_time ? \Carbon\Carbon::parse($delivery->pickup_time)->format('M d, Y H:i A') : 'N/A' }}</td>
        </tr>
        <tr>
            <th>Completion Time</th>
            <td>{{ $delivery->end_time ? \Carbon\Carbon::parse($delivery->end_time)->format('M d, Y H:i A') : 'N/A' }}</td>
        </tr>
    </table>

    <div class="page-break"></div>

    <!-- PAGE 2: Driver Checklist -->
    <div class="header">
        <h1>Washington Health</h1>
        <p>Driver Pre-Transit Checklist</p>
    </div>

    <div class="section-title">Checklist Items</div>
    @if($delivery->checklist)
        <table>
            <tr>
                <th>Vehicle Clean & Organized</th>
                <td>{!! $delivery->checklist->vehicle_clean ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>HVAC System Running (Target ~70°F)</th>
                <td>{!! $delivery->checklist->hvac_running ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>Temperature Logger Active</th>
                <td>{!! $delivery->checklist->logger_active ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>Clean/Dirty Separation Verified</th>
                <td>{!! $delivery->checklist->separation_verified ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>All Containers Properly Sealed</th>
                <td>{!! $delivery->checklist->containers_sealed ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>Environment Logs Completed</th>
                <td>{!! $delivery->checklist->logs_completed ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>Chain of Custody Signed</th>
                <td>{!! $delivery->checklist->chain_of_custody_signed ? '<span class="check-mark">✓ Yes</span>' : '<span class="cross-mark">✗ No</span>' !!}</td>
            </tr>
            <tr>
                <th>Completion Timestamp</th>
                <td>{{ $delivery->checklist->updated_at ? $delivery->checklist->updated_at->format('M d, Y H:i A') : 'N/A' }}</td>
            </tr>
        </table>
    @else
        <p>No checklist data recorded for this delivery.</p>
    @endif

    <div class="page-break"></div>

    <!-- PAGE 3: Temperature & Humidity Log -->
    <div class="header">
        <h1>Washington Health</h1>
        <p>Transit Environmental Log</p>
    </div>

    <div class="section-title">Temperature & Humidity Readings</div>
    @if($delivery->environmentLog)
        <table>
            <thead>
                <tr>
                    <th style="width:25%;">Checkpoint</th>
                    <th style="width:25%;">Temperature (°F)</th>
                    <th style="width:25%;">Humidity (%)</th>
                    <th style="width:25%;">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr class="{{ !$delivery->environmentLog->start_in_range ? 'out-of-range' : '' }}">
                    <td><strong>Start of Transit</strong></td>
                    <td>{{ $delivery->environmentLog->start_temp ?? '--' }}°F</td>
                    <td>{{ $delivery->environmentLog->start_humidity ?? '--' }}%</td>
                    <td>{!! $delivery->environmentLog->start_in_range ? '<span class="check-mark">In Range</span>' : '<span class="cross-mark">Out of Range</span>' !!}</td>
                </tr>
                <tr class="{{ !$delivery->environmentLog->mid_in_range ? 'out-of-range' : '' }}">
                    <td><strong>Midpoint</strong></td>
                    <td>{{ $delivery->environmentLog->mid_temp ?? '--' }}°F</td>
                    <td>{{ $delivery->environmentLog->mid_humidity ?? '--' }}%</td>
                    <td>{!! $delivery->environmentLog->mid_in_range ? '<span class="check-mark">In Range</span>' : '<span class="cross-mark">Out of Range</span>' !!}</td>
                </tr>
                <tr class="{{ !$delivery->environmentLog->end_in_range ? 'out-of-range' : '' }}">
                    <td><strong>End of Transit</strong></td>
                    <td>{{ $delivery->environmentLog->end_temp ?? '--' }}°F</td>
                    <td>{{ $delivery->environmentLog->end_humidity ?? '--' }}%</td>
                    <td>{!! $delivery->environmentLog->end_in_range ? '<span class="check-mark">In Range</span>' : '<span class="cross-mark">Out of Range</span>' !!}</td>
                </tr>
            </tbody>
        </table>

        @if($delivery->environmentLog->corrective_action)
            <div class="section-title" style="border-left-color: #dc2626;">Corrective Action Logged</div>
            <div style="padding: 10px; border: 1px solid #fee2e2; background-color: #fef2f2; font-style: italic;">
                "{{ $delivery->environmentLog->corrective_action }}"
            </div>
        @endif
    @else
        <p>No environmental data recorded for this delivery.</p>
    @endif

    <div class="page-break"></div>

    <!-- PAGE 4: Chain of Custody -->
    <div class="header">
        <h1>Washington Health</h1>
        <p>Chain of Custody Record</p>
    </div>

    @if($delivery->chainOfCustody)
        <div class="section-title">Transfer Details</div>
        <table>
            <tr>
                <th>Container IDs</th>
                <td>{{ $delivery->chainOfCustody->container_ids ?: 'N/A' }}</td>
            </tr>
            <tr>
                <th>Asset Condition</th>
                <td>{{ $delivery->chainOfCustody->condition ?: 'N/A' }}</td>
            </tr>
            <tr>
                <th>Pickup Department</th>
                <td>{{ $delivery->chainOfCustody->pickup_department ?: 'N/A' }}</td>
            </tr>
            <tr>
                <th>Delivery Department</th>
                <td>{{ $delivery->chainOfCustody->delivery_department ?: 'N/A' }}</td>
            </tr>
        </table>

        <div class="section-title">Transfer Hand-off Times</div>
        <table>
            <tr>
                <th>Pickup Transferred At</th>
                <td>{{ $delivery->chainOfCustody->pickup_time ? \Carbon\Carbon::parse($delivery->chainOfCustody->pickup_time)->format('M d, Y H:i A') : 'N/A' }}</td>
            </tr>
            <tr>
                <th>Delivery Received At</th>
                <td>{{ $delivery->chainOfCustody->delivery_time ? \Carbon\Carbon::parse($delivery->chainOfCustody->delivery_time)->format('M d, Y H:i A') : 'N/A' }}</td>
            </tr>
        </table>

        @if($delivery->chainOfCustody->exceptions)
            <div class="section-title">Exceptions / Notes</div>
            <p style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb;">{{ $delivery->chainOfCustody->exceptions }}</p>
        @endif

        <div class="section-title">Signatures</div>
        <div class="grid-container">
            <div class="grid-col" style="margin-right: 3%;">
                <strong>Releasing Agent / Driver</strong>
                <div class="signature-box">
                    @if($delivery->chainOfCustody->driver_signature)
                        <img src="{{ $delivery->chainOfCustody->driver_signature }}" alt="Driver Signature">
                    @else
                        <span style="color: #9ca3af; display: block; margin-top: 35px;">No signature captured</span>
                    @endif
                </div>
            </div>
            <div class="grid-col">
                <strong>Receiving Agent</strong>
                <div class="signature-box">
                    @if($delivery->chainOfCustody->receiver_signature)
                        <img src="{{ $delivery->chainOfCustody->receiver_signature }}" alt="Receiver Signature">
                    @else
                        <span style="color: #9ca3af; display: block; margin-top: 35px;">No signature captured</span>
                    @endif
                </div>
            </div>
        </div>
    @else
        <p>No chain of custody record found for this delivery.</p>
    @endif

</body>
</html>
