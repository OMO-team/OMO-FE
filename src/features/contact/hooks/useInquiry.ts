import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { instance } from '../../../lib/axios'
import type { ApiResponse } from '../../../shared/types/api'
import type {
    InquiryUploadUrlsRequest,
    InquiryUploadUrlsResponse,
    InquiryRequest,
    InquiryResponse,
} from '../types/contact'

export const useGetUploadUrls = () =>
    useMutation({
        mutationFn: (body: InquiryUploadUrlsRequest) =>
            instance.post<ApiResponse<InquiryUploadUrlsResponse>>(
                '/api/v1/inquiries/attachments/upload-urls',
                body,
            ),
    })

export const useUploadFileToS3 = () =>
    useMutation({
        mutationFn: ({ uploadUrl, file }: { uploadUrl: string; file: File }) =>
            axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type },
            }),
    })

export const usePostInquiry = () =>
    useMutation({
        mutationFn: (body: InquiryRequest) =>
            instance.post<ApiResponse<InquiryResponse>>('/api/v1/inquiries', body),
    })
