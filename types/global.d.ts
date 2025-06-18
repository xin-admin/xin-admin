declare namespace API {

    type IAnyObj = {
        [key: string]: unknown
    }

    type ErrorShowType =
        | 0      // 成功消息
        | 1      // 警告消息
        | 2      // 失败消息
        | 3      // 成功通知
        | 4      // 警告通知
        | 5      // 失败通知
        | 99;    // 无状态

    type ListResponse<T> = ResponseStructure<{
        data: T[]
        page: number
        total: number
        per_page: number
        current_page: number
    }> 

    // 与后端约定的响应数据格式
    interface ResponseStructure<T> {
        success: boolean
        data: T
        errorCode?: number
        msg?: string
        showType?: ErrorShowType
        status?: number
        description?: string
        placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight',
    }
}
