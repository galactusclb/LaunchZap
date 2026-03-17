import { ProductList } from "@/components/shared/product-list";
import Header from "./components/header";

export default function LandingPageContainer(){
    return (
        <div className="flex flex-col gap-6 w-full">
            <Header />
            <ProductList />
        </div>
    )
}