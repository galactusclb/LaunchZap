import { ProductFeedSection } from "@/components/shared/product-feed";
import FeedAsyncBoundary from "./components/feed-async-boundary";
import { getDailyProducts, getNewProducts, getWeeklyProducts } from "@/features/product/services/product.service";

export default function LandingPageContainer() {
	return (
		<div className="flex flex-col gap-20 w-full">
			<FeedAsyncBoundary>
				<ProductFeedSection
					header={{
						title: "Top Products Launching Today",
						description: "For the first 4 hours of the day, we're hiding upvotes to help every product get a chance to catch your interest. Read more"
					}}
					endpoint="/products?q=daily"
					fetcher={getDailyProducts} />
			</FeedAsyncBoundary>
			<FeedAsyncBoundary>
				<ProductFeedSection
					header={{
						title: "This Week",
						description: "For the first 4 hours of the day, we're hiding upvotes to help every product get a chance to catch your interest. Read more"
					}}
					endpoint="/products?q=weekly"
					fetcher={getWeeklyProducts} />
			</FeedAsyncBoundary>
			<FeedAsyncBoundary>
				<ProductFeedSection
					header={{
						title: "New Arrivals",
						description: "For the first 4 hours of the day, we're hiding upvotes to help every product get a chance to catch your interest. Read more"
					}}
					endpoint="/products?q=new"
					fetcher={getNewProducts} />
			</FeedAsyncBoundary>
		</div>
	);
}
