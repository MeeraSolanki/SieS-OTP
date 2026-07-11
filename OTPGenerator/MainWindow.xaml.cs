using System;
using System.Security.Cryptography;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace OTPGenerator
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            datePicker.SelectedDate = DateTime.Now;
        }

        private void btnGenerate_Click(object sender, RoutedEventArgs e)
        {
            string userId = txtUserId.Text.Trim();
            DateTime? date = datePicker.SelectedDate;

            if (string.IsNullOrEmpty(userId))
            {
                ShowError("Please enter a User ID.");
                txtOTP.Clear();
                return;
            }

            if (!date.HasValue)
            {
                ShowError("Please select a valid date.");
                txtOTP.Clear();
                return;
            }

            if (!userId.Equals("admin", StringComparison.OrdinalIgnoreCase))
            {
                ShowError("OTP generation is only allowed for the admin user.");
                txtOTP.Clear();
                return;
            }

            HideError();
            string otp = GenerateOtp(userId, date.Value);
            txtOTP.Text = otp;
        }

        private string GenerateOtp(string userId, DateTime date)
        {
            string s = $"{userId}:{date:yyyyMMdd}";
            using (SHA256 sHA = SHA256.Create())
            {
                byte[] hash = sHA.ComputeHash(Encoding.UTF8.GetBytes(s));
                int value = BitConverter.ToInt32(hash, 0);
                return (Math.Abs(value) % 1000000).ToString("D6");
            }
        }

        private void btnCopy_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(txtOTP.Text))
            {
                Clipboard.SetText(txtOTP.Text);
                MessageBox.Show("OTP copied to clipboard!", "Success", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        private void ShowError(string message)
        {
            txtErrorMessage.Text = message;
            ErrorBorder.Visibility = Visibility.Visible;
        }

        private void HideError()
        {
            txtErrorMessage.Text = string.Empty;
            ErrorBorder.Visibility = Visibility.Collapsed;
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
            {
                this.DragMove();
            }
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void txtUserId_TextChanged(object sender, TextChangedEventArgs e)
        {
            HideError();
            txtOTP.Clear();
        }

        private void datePicker_SelectedDateChanged(object sender, SelectionChangedEventArgs e)
        {
            HideError();
            txtOTP.Clear();
        }
    }
}