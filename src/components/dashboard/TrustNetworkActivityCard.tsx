
import { useEffect, useState } from "react";
import { TrustNetworkActivity } from "../../types/user";
import { useAuth } from "../../contexts/AuthContext";

export default function TrustNetworkActivityCard() {
  const { pendingTransactions } = useAuth();
  const [activities, setActivities] = useState<TrustNetworkActivity[]>([]);

  useEffect(() => {
    // Convert transactions to trust network activities
    const recentActivities = pendingTransactions
      .filter(tx => tx.status !== 'pending')
      .slice(0, 5)
      .map(tx => {
        if (tx.status === 'approved') {
          return {
            id: `${tx.id}-activity`,
            type: 'approval' as const,
            description: `Transaction of $${tx.amount} was approved`,
            timestamp: tx.reviewedAt || tx.timestamp,
            trustPointsChange: tx.trustPointsEarned
          };
        } else {
          return {
            id: `${tx.id}-activity`,
            type: 'fraud_attempt' as const,
            description: `Transaction of $${tx.amount} was rejected`,
            timestamp: tx.reviewedAt || tx.timestamp,
            networkProtected: true
          };
        }
      });

    setActivities(recentActivities);
  }, [pendingTransactions]);

  return (
    <div className="glass-card p-6 rounded-xl animate-scale-in">
      <h3 className="text-xl font-bold mb-4">Trust Network Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent trust network activity
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <div 
              key={activity.id} 
              className={`glass-card p-4 rounded-lg ${
                activity.type === 'fraud_attempt' ? 'border-red-500/20' : 'border-green-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {activity.type === 'approval' ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                      <svg
                        className="h-4 w-4 text-green-400"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                      <svg
                        className="h-4 w-4 text-red-400"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{activity.description}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {activity.trustPointsChange && (
                    <span className="text-green-400 font-medium">
                      +{activity.trustPointsChange} Trust Points
                    </span>
                  )}
                  
                  {activity.networkProtected && (
                    <span className="text-red-400 font-medium">
                      Network Protected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
