import { apiClient } from './client';
import { API_CONFIG, OTPRegisterRequest, OTPVerifyRequest, OTPResponse } from './config';
import { handleCorsError, isCorsError } from './cors-handler';

export class OTPService {
  /**
   * Request OTP for registration
   */
  async requestOTP(requestData: OTPRegisterRequest): Promise<OTPResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.post<any>(
        API_CONFIG.ENDPOINTS.OTP.REGISTER,
        requestData as unknown as Record<string, unknown>
      );

      if (response.success === false) {
        const message = response.message || 'OTP is available';
        
        // Check if the message contains "existing" - means there's already a valid OTP
        if (message.toLowerCase().includes('existing')) {
          let remainingSeconds = 300; // Default 5 minutes
          const timeMatch = message.match(/(\d+)\s*seconds?/i);
          if (timeMatch) {
            remainingSeconds = parseInt(timeMatch[1], 10);
          }
          
          return {
            success: true, // Treat as success to navigate to OTP page
            message: message,
            data: {
              //eslint-disable-next-line
              email: (response as any).email || requestData.email,
              expires_at: new Date(Date.now() + remainingSeconds * 1000).toISOString(),
              remainingSeconds: remainingSeconds
            }
          };
        }
        
        // For other failure cases, return as failure
        return {
          success: false,
          message: message,
          data: {
            //eslint-disable-next-line
            email: (response as any).email || requestData.email
          }
        };
      }

      return {
        success: true,
        message: response.message || 'OTP sent successfully',
        data: {
          //eslint-disable-next-line
          email: (response as any).email || requestData.email,
          //eslint-disable-next-line
          expires_at: (response as any).expiresIn ? new Date(Date.now() + (response as any).expiresIn * 1000).toISOString() : undefined,
          //eslint-disable-next-line
          remainingSeconds: (response as any).expiresIn || 300 
        }
      };
    } catch (error) {
      if (isCorsError(error)) {
        throw new Error(handleCorsError(error));
      }
      throw error;
    }
  }


  async verifyOTP(verifyData: OTPVerifyRequest): Promise<OTPResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await apiClient.post<any>(
        API_CONFIG.ENDPOINTS.OTP.VERIFY,
        verifyData as unknown as Record<string, unknown>
      );
     
      if (response.success === false) {
        return {
          success: false,
          message: response.message || 'Invalid OTP. Please try again.',
          data: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            email: (response as any).email || verifyData.email
          }
        };
      }

      return {
        success: true,
        message: response.message || 'OTP verified successfully',
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          email: (response as any).email || verifyData.email
        }
      };
    } catch (error) {
      if (isCorsError(error)) {
        throw new Error(handleCorsError(error));
      }
      throw error;
    }
  }
}

export const otpService = new OTPService();