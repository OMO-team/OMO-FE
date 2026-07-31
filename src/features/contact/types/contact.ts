export type InquiryFileInfo = {
    fileName: string
    contentType: string
    fileSize: number
}

export type InquiryUploadUrlsRequest = {
    files: InquiryFileInfo[]
}

export type InquiryUploadItem = {
    uploadUrl: string
    objectKey: string
    contentType: string
    expiresAt: string
}

export type InquiryUploadUrlsResponse = {
    uploadToken: string
    uploads: InquiryUploadItem[]
}

export type InquiryRequest = {
    type: string
    name: string
    email: string
    content: string
    uploadToken: string
    attachmentKeys: string[]
} 

export type InquiryResponse = {
    inquiryId: number    
    status: string
    createdAt: string
}