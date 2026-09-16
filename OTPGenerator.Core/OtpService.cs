using System;
using System.Security.Cryptography;
using System.Text;

namespace OTPGenerator.Core
{
    public static class OtpService
    {
        public static string GenerateOtp(string userId, DateTime date)
        {
            string s = $"{userId}:{date:yyyyMMdd}";
            using (SHA256 sHA = SHA256.Create())
            {
                byte[] hash = sHA.ComputeHash(Encoding.UTF8.GetBytes(s));
                int value = BitConverter.ToInt32(hash, 0);
                return (Math.Abs(value) % 1000000).ToString("D6");
            }
        }
    }
}
