import React from 'react';

const BottomPanel = () => {
    return (
        <div className="fixed-bottom" style={{"background": "#cc6633", "color": "#fff"}}>
            <div class="container-fluid">
                <div class="row">
                    <div class="offset-md-8 col-md-4 text-right">
                        155 apps | Only installed
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomPanel;

