import { API, POST } from "$lib";
import {  fail, type Actions } from "@sveltejs/kit";


export const actions = {
    
    forgot: async ({request,cookies}) => {
        
        const data = await request.formData();
        const accesstoken = cookies.get("session_id")

        const response = await POST(API.forgotpassword,{
            "email":data.get("email")
        },accesstoken)
        .then(res => res.json())
        .then(res => {
            if (res.status == 200){
                if (res.success){
                    return res
                }else{
                    return fail(400,{...res,"err":res.message})
                }
            }else{
                return fail(400,{...res,"err":res.message})
            }
        })
        .catch(err => {
            return fail(400,{
                "success":false,
                "err":"Unable to resolve the response. Please re-try after sometime",
            })
        })

        return response

    }
} satisfies Actions;