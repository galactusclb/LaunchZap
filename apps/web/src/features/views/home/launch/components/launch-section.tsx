import { getLaunchBySlug } from '@/features/launch/index.server';

import LaunchDetails from './launch-details';
import LaunchHero from './launch-hero';
import LaunchNotFound from './launch-not-found';

interface LaunchSectionProps {
    slug: string;
}

export default async function LaunchSection({ slug }: LaunchSectionProps) {
    const launch = await getLaunchBySlug(slug);

    if (!launch) return <LaunchNotFound />;

    return (
        <div className="flex flex-col gap-10">
            <LaunchHero launch={launch} />
            <LaunchDetails description={launch.description} />
        </div>
    );
}
