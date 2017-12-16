using System;
using System.IO;
using project_001.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace project_001.Controllers
{
    public class ContactController : Controller
    {
        private static bool success = false;
        private static IConfigurationRoot Configuration {get;set;}

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Send(ContactModel email)
        {
            if (!ModelState.IsValid)
            {
                return View("Index");
            }

            try
            {
                ViewBag.ErrorMessage = null;

                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json");
                Configuration = builder.Build();

                var adminAdress = Configuration["EmailOptions:Admin"];
                var adress = Configuration["EmailOptions:Email"];
                var host = Configuration["EmailOptions:Host"];
                var port = Convert.ToInt32(Configuration["EmailOptions:Port"]);
                var password = Configuration["EmailOptions:password"];

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(email.Address,adress));
                message.To.Add(new MailboxAddress(adminAdress));
                message.Subject = email.Topic;
                message.Body = new TextPart("plain")
                { Text = email.Text };

                using (var smtpClient = new SmtpClient())
                {
                    smtpClient.Connect(host,port,true);
                    smtpClient.Authenticate(adress,password);
                    smtpClient.Send(message);
                    smtpClient.Disconnect(true);
                    success = true;
                }
            }
            catch (Exception e)
            {
                success = false;
                ViewBag.ErrorMessage = e.Message;
            }
            ViewBag.Success = success;

            return View("Index");
        }
    }
}