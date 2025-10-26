import React from 'react';
import CardDetails from './CardDetails';
import ActivityTimeline from './ActivityTimeline';

function CardDetailsContainer() {
    return (
    <div className="h-screen bg-background flex flex-col">
      {/* Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task Details */}
        <div className="flex-1 overflow-y-auto">
          <CardDetails />
        </div>
        
        {/* Activity Timeline */}
        <div className="border-l border-border overflow-y-auto">
          <ActivityTimeline />
        </div>
      </div>
    </div>
    );
};

export default CardDetailsContainer;