export async function action({request, params}) {
    const id = params.id;
    const data = await request.formData();
    const newDesc = data.get("description");
    const newAmount = data.get("amount");
    try {

    } catch(e) {

    };
}