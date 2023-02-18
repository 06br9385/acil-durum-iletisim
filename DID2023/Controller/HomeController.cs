using DID2023.Helper;
using LiteDB;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DID2023.Controller
{
    public class HomeController : Microsoft.AspNetCore.Mvc.Controller, IBaseModel
    {
        public string DbName => Consts.Db;

        public string Add(string obj)
        {
            try
            {
                var person = JsonConvert.DeserializeObject<Personal>(obj);
                var database = DbName.Replace("sehir", person.sehir1).Replace("ilce", person.ilce1);
                using (var db = new LiteDatabase(database))
                {
                    var table = db.GetCollection<Personal>(Consts.Table);
                    if (!isPerson(table, person.tel1))
                    {
                        table.Insert(person);
                        return Consts.Info;
                    }
                    else
                    {
                        return Consts.IsExists;
                    }

                }


            }
            catch (Exception ex)
            {
                return Consts.Error + ex;
            }
        }

        public List<PersonelViewModel> GetPersonLocation(string obj)
        {
            List<PersonelViewModel> model = new List<PersonelViewModel>();
            try
            {
                var location = JsonConvert.DeserializeObject<Personal>(obj);
                var database = DbName.Replace("sehir", location.sehir1).Replace("ilce", location.ilce1);

                using (var db = new LiteDatabase(database))
                {
                    var table = db.GetCollection<Personal>(Consts.Table);
                    var mahalle =location.mahalle1.Length > 3 ? location.mahalle1.Trim()[..2]: location.mahalle1.Trim();
                    var sokak = location.sokak1.Length > 3 ? location.sokak1.Trim()[..2] : location.sokak1.Trim();
                    if (string.IsNullOrEmpty(location.tel1) && string.IsNullOrEmpty(location.adsoyad1))
                    {
                        var personals = table.Query().
                       Where(
                       x =>
                       x.sehir1 == location.sehir1 &&
                       x.ilce1 == location.ilce1 &&
                       x.mahalle1.StartsWith(mahalle) &&
                       x.sokak1.StartsWith(sokak)
                       ).ToList();

                        var bina = personals.ToLookup(p => p.binano1);

                        if (bina.Any())
                        {
                            foreach (var item in bina)
                            {
                                model.Add(new PersonelViewModel
                                {
                                    bina = item.Key
                                });
                            }

                            foreach (var item in personals)
                            {
                                var mm = model.FirstOrDefault(c => c.bina == item.binano1);
                                mm.perList.Add(item);
                            }
                        }
                    }
                    else if (!string.IsNullOrEmpty(location.tel1) && !string.IsNullOrEmpty(location.adsoyad1))
                    {
                        var ad = location.adsoyad1.Trim().Split(' ').First();
                        var soyad = location.adsoyad1.Trim().Split(' ').Last();
                        var personals = table.Query().
                      Where(
                      x =>
                      x.sehir1 == location.sehir1 &&
                      x.ilce1 == location.ilce1 &&
                       x.mahalle1.StartsWith(mahalle) &&
                       x.sokak1.StartsWith(sokak) &&
                      (x.adsoyad1.Contains(ad) || x.adsoyad1.Contains(soyad) || x.adsoyad1.Contains(location.adsoyad1)) &&
                      x.tel1.Substring(1).Replace("(", "").Replace(")", "") == location.tel1
                      ).ToList();

                        var bina = personals.ToLookup(p => p.binano1);

                        if (bina.Any())
                        {
                            foreach (var item in bina)
                            {
                                model.Add(new PersonelViewModel
                                {
                                    bina = item.Key
                                });
                            }

                            foreach (var item in personals)
                            {
                                var mm = model.FirstOrDefault(c => c.bina == item.binano1);
                                mm.perList.Add(item);
                            }
                        }
                    }

                }

                return model;
            }
            catch
            {
                return model;
            }
        }

        public List<Personal> GetPersonName(string obj)
        {
            throw new NotImplementedException();
        }

        public bool isPerson(ILiteCollection<Personal> table, string tel)
        {
            var result = table.Query().Where(x => x.tel1 == tel).Count();
            return result > 0;

        }

    }
}
