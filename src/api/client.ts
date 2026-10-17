export async function api<T>(base: string, path: string, options: RequestInit = {}): Promise<T>{
    const token = localStorage.getItem('token')
    try{
        const response = await fetch(`${base}${path}`,{
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token && {Authorization: `Bearer ${token}`} ),
                ...options.headers
            }
        })
        if(!response.ok){
            throw new Error(`Request failed with ${response.status}`)
        }
        return await response.json()
    }
    catch(err){
        console.error(`Request failed with error ${err}`)
        throw err
    }
    
}

export const authApi = <T>(path:string, options?:RequestInit) => api<T>(import.meta.env.VITE_AUTH_API_URL, path, options)