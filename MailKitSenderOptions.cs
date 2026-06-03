using MailKit.Security;

internal class MailKitSenderOptions
{
    public string Server { get; set; }
    public int Port { get; set; }
    public bool RequiresAuthentication { get; set; }
    public string User { get; set; }
    public string Password { get; set; }
    public SecureSocketOptions SocketOptions { get; set; }
}