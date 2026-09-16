using System;
using Microsoft.Maui.Controls;
using OTPGenerator.Core;

namespace OTPGenerator.Mobile
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            dtpDate.Date = DateTime.Now;
        }

        private void btnGenerate_Clicked(object? sender, EventArgs e)
        {
            string userId = entUserId.Text?.Trim() ?? string.Empty;
            DateTime date = dtpDate.Date ?? DateTime.Now;

            if (string.IsNullOrEmpty(userId))
            {
                ShowError("Please enter a User ID.");
                entOTP.Text = string.Empty;
                return;
            }

            if (!userId.Equals("admin", StringComparison.OrdinalIgnoreCase))
            {
                ShowError("User ID is invalid.Enter a valid User ID.");
                entOTP.Text = string.Empty;
                return;
            }

            HideError();
            string otp = OtpService.GenerateOtp(userId, date);
            entOTP.Text = otp;
        }

        private async void btnCopy_Clicked(object? sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(entOTP.Text))
            {
                await Clipboard.Default.SetTextAsync(entOTP.Text);
                await DisplayAlertAsync("Success", "OTP copied to clipboard!", "OK");
            }
        }

        private void ShowError(string message)
        {
            lblErrorMessage.Text = message;
            ErrorBorder.IsVisible = true;
        }

        private void HideError()
        {
            lblErrorMessage.Text = string.Empty;
            ErrorBorder.IsVisible = false;
        }

        private void entUserId_TextChanged(object? sender, TextChangedEventArgs e)
        {
            HideError();
            entOTP.Text = string.Empty;
        }

        private void dtpDate_DateSelected(object? sender, DateChangedEventArgs e)
        {
            HideError();
            entOTP.Text = string.Empty;
        }
    }
}



















