import { getDailyProducts, getNewProducts, getWeeklyProducts } from "@/features/product";

import FeedSection from "./components/feed-section";

export default function LandingPageContainer() {
	return (
		<div className="flex flex-col w-full">
			<div className="mb-12">
				<h1 className="text-5xl font-black tracking-tight">Today&apos;s Launches</h1>
				<p className="mt-2 text-muted-foreground text-lg">
					Discover what makers are shipping right now.
				</p>
			</div>

			<div className="flex flex-col gap-16 w-full">
				<FeedSection
					title="Top Products Launching Today"
					description="Upvotes are hidden for the first 4 hours so every product gets a fair shot."
					endpoint="/products?q=daily"
					fetcher={getDailyProducts}
				/>
				<FeedSection
					title="This Week"
					description="The best products launched over the past 7 days."
					endpoint="/products?q=weekly"
					fetcher={getWeeklyProducts}
				/>
				<FeedSection
					title="New Arrivals"
					description="Fresh submissions from the maker community."
					endpoint="/products?q=new"
					fetcher={getNewProducts}
				/>
			</div>
		</div>
	);
}
