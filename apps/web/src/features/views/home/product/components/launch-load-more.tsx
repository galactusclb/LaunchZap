'use client';

import FeedLoadMore from '@/components/shared/feed-load-more';
import { Launch, launchListResponseSchema } from '@/models/launch.schema';
import { apiGet } from '@/utils/api/api-client';

import LaunchItem from './launch-item';

interface LaunchLoadMoreProps {
    endpoint: string;
}

const fetchPage = async (endpoint: string, page: number) => {
    const res = await apiGet(`${endpoint}?page=${page}`, launchListResponseSchema);
    if (!res.success) throw new Error(`Failed to fetch page ${page}`);
    return { data: res.data ?? [], meta: res.meta };
};

export default function LaunchLoadMore({ endpoint }: LaunchLoadMoreProps) {
    return (
        <FeedLoadMore<Launch>
            queryKey={['launches-more', endpoint]}
            fetchPage={(page) => fetchPage(endpoint, page)}
            renderItem={(item) => <LaunchItem item={item} key={item.id} />}
        />
    );
}
