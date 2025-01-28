import { useFetcher, useParams } from '@remix-run/react';

function DeleteEntity({ category, descriptions }: { category: "expenses" | "income", descriptions: string[] }) {
    const fetcher = useFetcher();
    const { id } = useParams();

    return (
        <div className="mx-auto mb-2 md:mb-4">
            <h3>Select lines of description to remove from {category || "your budget"}</h3>
            <fetcher.Form method="post" action={`/profile/${id}/remove${category}`}>
                <fieldset className="mb-3">
                    {
                        descriptions.map((item: string, idx: number) => (
                            <>
                                <label>
                                    <input type="radio" name={category === "expenses" ? "expense_item" : "income_item"} value={item} required />{item}
                                </label>
                                <br />
                            </>
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