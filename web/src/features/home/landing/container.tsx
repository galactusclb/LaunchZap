import { ProductList } from "@/components/shared/product-list";
import Header from "./components/header";
import { Suspense } from "react";

export default function LandingPageContainer() {
	return (
		<div className="flex flex-col gap-6 w-full">
			<Header />
			<Suspense fallback={<>Loading....</>}>
				<ProductList/>
			</Suspense>
			<p>Some other values</p>
		</div>
	);
}
