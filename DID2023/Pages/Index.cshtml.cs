using DID2023.Helper;
using LiteDB;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.CodeAnalysis;
using System.Reflection;

namespace DID2023.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            //var database = @"DID2023_34_34.db";
            //using (var db = new LiteDatabase(database))
            //{
            //    var table = db.GetCollection<Personal>(Consts.Table);
            //    var personals = table.Query().ToList();

            //}
        }
    }
}