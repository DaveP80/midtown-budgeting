import { useFetcher, useParams } from '@remix-run/react';

function DeleteEntity({ category, descriptions}: { category: "expenses" | "income", descriptions: string[]}) {
    const fetcher = useFetcher();
    const { id } = useParams();

    return (
        <div className="mx-auto mb-2 md:mb-4 bg-gray-100 border border-gray-300">
            <h3>Select lines of description to remove from {category || "your budget"}</h3>
            <fetcher.Form method="post" action={`/profile/${id}/remove${category}`}>
                <fieldset className="mb-3">
                    {
                        descriptions.map((item: string, idx: number) => (
                            <div key={idx}>
                                <label>
                                {item}
                                </label>
                                    <input type="radio" name={category === "expenses" ? "expense_item" : "income_item"} value={item} required className="mx-1"/>
                                <br />
                            </div>
                        ))

                    }
                </fieldset>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Commit Selection
                </button>
            </fetcher.Form>
        </div>
    );
};

export default DeleteEntity;