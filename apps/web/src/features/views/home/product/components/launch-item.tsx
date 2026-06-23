import { Launch } from '@/models/launch.schema';

// import LaunchVoteButton from './launch-vote-button';

interface LaunchItemProps {
    item: Launch;
}

export default function LaunchItem({ item }: LaunchItemProps) {
    return (
        <div className="flex gap-4 p-4 bg-card rounded-lg items-start">
            <div className="flex flex-col flex-1 gap-1">
                <span className="font-semibold text-primary">{item.tagline}</span>
                <span className="text-sm text-muted-foreground">
                    {new Date(item.launchDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </span>
            </div>
            {/* <LaunchVoteButton
                productId={item.productId}
                launchId={item.id}
                votesCount={item.votesCount}
            /> */}
        </div>
    );
}
