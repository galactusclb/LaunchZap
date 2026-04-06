import { ProductFeedSection } from "@/components/shared/product-feed";
import Header from "./components/header";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/errors";
import { getDailyProducts } from "@/components/shared/product-feed/apit";

export default function LandingPageContainer() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<Header />
			<ErrorBoundary>
				<Suspense fallback={<>Loading....</>}>
					<ProductFeedSection 
						title="Daily Hits"
						fetcher={getDailyProducts}/>
				</Suspense>
			</ErrorBoundary>
			{/* <ProductFeedSection title="This Week" fetcher={getWeeklyProducts} /> */}
			{/* <ProductFeedSection title="New Arrivals" fetcher={getNewProducts} /> */}
		</div>
	);
}
