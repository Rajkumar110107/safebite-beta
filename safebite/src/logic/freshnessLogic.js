export const calculateFreshness = (nh3, h2s, voc, foodMode) => {
    const nh3Val = parseFloat(nh3) || 0;
    const h2sVal = parseFloat(h2s) || 0;
    const vocVal = parseFloat(voc) || 0;
    
    const avg = (nh3Val + h2sVal + vocVal) / 3;
    let status, recommendation, timeRemaining;
    let colorClass, iconType;
    
    if (avg < 200) {
        status = 'Fresh';
        colorClass = 'status-green';
        iconType = 'check';
    } else if (avg <= 400) {
        status = 'Consume Soon';
        colorClass = 'status-yellow';
        iconType = 'alert';
    } else {
        status = 'Spoiled';
        colorClass = 'status-red';
        iconType = 'x';
    }

    if (avg > 400) {
        recommendation = 'Discard immediately to prevent foodborne illness.';
        timeRemaining = '0 hours';
    } else {
        switch (foodMode) {
            case 'Chicken':
                recommendation = avg < 200 ? 'Store properly in freezer or fridge.' : 'Cook immediately to 165°F (74°C).';
                timeRemaining = avg < 200 ? '2-3 days' : '< 12 hours';
                break;
            case 'Fish':
                recommendation = avg < 200 ? 'Keep tightly sealed in chill drawer.' : 'Refrigerate urgently or discard if off-odors exist.';
                timeRemaining = avg < 200 ? '1-2 days' : '< 6 hours';
                break;
            case 'Fruits':
                recommendation = avg < 200 ? 'Looking excellent.' : 'Consume soon or process into a smoothie/compote.';
                timeRemaining = avg < 200 ? '5-7 days' : '1-2 days';
                break;
            case 'Milk':
                recommendation = avg < 200 ? 'Keep at 40°F (4°C) in main fridge compartment.' : 'Use quickly in cooking, or discard if curdling.';
                timeRemaining = avg < 200 ? '4-5 days' : '< 24 hours';
                break;
            default:
                recommendation = 'Store appropriately.';
                timeRemaining = 'Unknown';
        }
    }

    return { 
        nh3: nh3Val, h2s: h2sVal, voc: vocVal, 
        avg: avg.toFixed(1), 
        status, recommendation, timeRemaining, colorClass, iconType 
    };
};
