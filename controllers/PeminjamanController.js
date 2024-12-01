const { Op, where } = require('sequelize');
const moment = require('moment');
const sequelize = require('sequelize');
const { Role, User, Ruangan, Peminjaman, DetailPeminjaman, Notifikasi } = require('../models');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const libreConvert = require('libreoffice-convert');
const pusher = require('../utils/pusherConfig');
const ejs = require('ejs');
const pdf = require('html-pdf');
const schedule = require('node-schedule');
const { log } = require('console');


const formPinjamRuangan = async (req, res, next) => {
  try {
    let user = null;
    if (req.user) {
      const userId = req.user.idUser;
      user = await User.findOne({ where: { idUser: userId } });
    }

    const id = req.params.id;
    let ruangan;
    if (id) {
      ruangan = await Ruangan.findOne({ where: { idRuangan: id } });
    }

    if (!id || !ruangan) {
        return res.redirect('auth/login');
    }

    if (user) {
      // Ambil tanggal yang sudah dibooking
      const bookedDates = await DetailPeminjaman.findAll({
        where: { idRuangan: id },
        attributes: ['tanggalMulai', 'tanggalSelesai'], // Pastikan field sesuai dengan database
      });

      const formattedDates = bookedDates.map((booking) => ({
        start: booking.tanggalMulai,
        end: booking.tanggalSelesai,
      }));

      // Fetch the list of current bookings for the room
      const peminjamanList = await DetailPeminjaman.findAll({
        where: { idRuangan: id },
        order: [['tanggalMulai', 'ASC']], // Order by start date
      });

      const message = req.cookies.message ? JSON.parse(req.cookies.message) : null;

      res.cookie('message', '', { maxAge: 1000, httpOnly: true });

      res.render('user/pinjam-ruangan', {
        activePage: 'daftar-ruangan',
        user,
        ruangan,
        message,
        formattedDates: JSON.stringify(formattedDates), // Kirim data ke frontend
        peminjamanList, // Send the list of bookings to the view
      });
    } else {
      return res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
};


const pinjamRuangan = async (req, res, next) => {
  try {
      const user = req.user.idUser;
      const { namaRuangan, kegiatan, tanggalMulai,tanggalSelesai, waktuMulai, waktuSelesai } = req.body;
      const idRuangan = req.params.id;

      if ( !kegiatan || !tanggalMulai  || !tanggalSelesai || !waktuMulai || !waktuSelesai) {
        res.cookie('message', JSON.stringify({ type: 'error', text: 'Semua field wajib diisi' }), { maxAge: 60000 });
        return res.redirect('/user/pinjam-ruangan/' + idRuangan);
    }
    

    const existingBooking = await DetailPeminjaman.findOne({
      where: {
        idRuangan,
        [Op.or]: [
          {
            tanggalMulai: { [Op.between]: [tanggalMulai, tanggalSelesai] },
          },
          {
            tanggalSelesai: { [Op.between]: [tanggalMulai, tanggalSelesai] },
          },
        ],
      },
    });

    if (existingBooking) {
      res.cookie('message', JSON.stringify({ type: 'error', text: 'Tanggal sudah dibooking' }), { maxAge: 60000 });
      return res.redirect('/user/pinjam-ruangan/' + idRuangan);    }


      const idPeminjam = await User.findOne({ where: { idUser: user } });

      if (!idPeminjam) {
          return res.status(404).json({ message: 'User not found' });
      }

      const ruangan = await Ruangan.findOne({ where: { idRuangan: idRuangan } });

      if (!ruangan) {
          return res.redirect('auth/login');
      }

      
      const formulir = req.file ? req.file.filename : null;
      const pdfFileName = formulir;
      const pathPDFFile = `uploads/formulir/${pdfFileName}`;
      
      
      const statusPengajuan = 'Menunggu';


      const newPeminjaman = await Peminjaman.create({
          idPeminjam: idPeminjam.idUser,
          idAdmin: 1,
          kegiatan,
          formulir,
          tanggalMulai,
          tanggalSelesai,
          statusPengajuan,
          tanggalKeputusan: null,
          alasanPenolakan: null
      });

      const newDetailPeminjaman = await DetailPeminjaman.create({
          idPeminjaman: newPeminjaman.idPeminjaman,
          idRuangan: ruangan.idRuangan,
          tanggalMulai,
          tanggalSelesai,
          jamMulai: waktuMulai,
          jamSelesai: waktuSelesai
      });

      return res.redirect('/user/daftar-ruangan')
  } catch (error) {
      console.log(error,">>>>>>>>>>>>>>>>>>>>")
      next(error);
  }
};

const dataPeminjaman = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const user = await User.findOne({ where: { idUser: userId } });
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');

    const peminjamans = await Peminjaman.findAll({
      where: {
        idPeminjam: userId,
        [Op.or]: [
          { statusPengajuan: 'Menunggu' },
          {
            statusPengajuan: 'Disetujui',
            [Op.or]: [
              { '$detailPeminjaman.tanggalMulai$': { [Op.gt]: currentDateTime.split(' ')[0] } },
              {
                '$detailPeminjaman.tanggalMulai$': currentDateTime.split(' ')[0],
                [Op.and]: [
                  sequelize.where(
                    sequelize.fn('CONCAT', 
                      sequelize.col('detailPeminjaman.tanggalMulai'), 
                      ' ', 
                      sequelize.col('detailPeminjaman.jamSelesai')
                    ),
                    { [Op.gt]: currentDateTime }
                  )
                ]
              }
            ]
          }
        ]
      },
      attributes: ['idPeminjaman', 'kegiatan', 'formulir', 'statusPengajuan'],
      include: [
        {
          model: DetailPeminjaman,
          as: 'detailPeminjaman',
          attributes: ['tanggalMulai','tanggalSelesai', 'jamMulai', 'jamSelesai'],
          include: [
            {
              model: Ruangan,
              as: 'ruangan',
              attributes: ['namaRuangan'],
            },
          ],
        },
      ],
    });
    
    res.render('user/data-peminjaman', { activePage:'data-peminjaman', user, peminjamans });
  } catch (error) {  
    next(error);
  }
};  

const detailPeminjaman = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const idPeminjaman = req.params.idPeminjaman;

    const user = await User.findOne({ where: { idUser: userId } });
    
    console.log(user,">>>>>>>>>user")

    const peminjaman = await Peminjaman.findOne({where: {idPeminjaman},
      attributes: ['idPeminjaman', 'kegiatan', 'statusPengajuan', 'tanggalMulai','tanggalSelesai', 'formulir','createdAt'],
      include: [
      {
        model: User,
        as: 'peminjam',
        attributes: ['nama', 'username', 'noHp', 'gender'],
      },
      {
        model: User,
        as: 'admin',
        attributes: ['nama'],
      },
      {
        model: DetailPeminjaman,
        as: 'detailPeminjaman',
        attributes: ['tanggalMulai','tanggalSelesai', 'jamMulai', 'jamSelesai'],
        include: [
          {
            model: Ruangan,
            as: 'ruangan',
            attributes: ['namaRuangan'],
          },
        ],
      },
      ],
    });

  const adminRoleId = await Role.findOne({ where: { namaRole: 'admin' } }).then(role => role.idRole);
  const userRoleId = await Role.findOne({ where: { namaRole: 'user' } }).then(role => role.idRole);
  
  console.log(peminjaman,">>>>>>>>>>>>>>>>>>>>>>>>");
  if(user.idRole === userRoleId) {
      res.render('user/detail-peminjaman', { activePage:'data-peminjaman', user, peminjaman });
  } else if(user.idRole === adminRoleId) {
      res.render('admin/detail-peminjaman', { currentPage: 'peminjaman', user, peminjaman });
  }
  } catch (error) {  
    next(error);
  }
};


const batalPeminjaman = async (req, res, next) => {
  const { idPeminjaman } = req.params;

  try {
      const peminjaman = await Peminjaman.findOne({ where: { idPeminjaman } });

      if (!peminjaman) {
          return res.status(404).json({ message: 'Peminjaman not found' });
      }

      await peminjaman.destroy();

      return res.redirect('/user/data-peminjaman');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error cancelling peminjaman');
  }
};

const sendNotification = async (idUser, message) => {
  await Notifikasi.create({ idUser: idUser, message });
  pusher.trigger('notifications', 'tolak-peminjaman', {
    idUser,
    message,  
  });
};

const approvePeminjaman = async (req, res, next) => {
  try {
    const idPeminjaman = req.params.idPeminjaman;
    console.log('idPeminjaman:', idPeminjaman);

    const idAdmin = req.user.idUser;
    console.log('idAdmin:', idAdmin);

    const peminjaman = await Peminjaman.findByPk(idPeminjaman, {
      include: [
        {
          model: User,
          as: 'peminjam',
          attributes: ['idUser', 'nama', 'username', 'noHp'],
        },
        {
          model: DetailPeminjaman,
          as: 'detailPeminjaman',
          include: [
            {
              model: Ruangan,
              as: 'ruangan'
            }
          ]
        }
      ]
    });

    if (!peminjaman) {
      return res.status(404).json({ message: 'Peminjaman not found' });
    }

    console.log(peminjaman);


    const templatePath = path.resolve("public/templates", "template_surat_peminjaman.docx");
    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true
    });

    doc.setData({
      dsi: "Departemen Sistem Informasi",
      id: peminjaman.idPeminjaman,
      nama: peminjaman.peminjam.nama,
      acara: peminjaman.kegiatan,
      tanggalMulai: new Date(peminjaman.detailPeminjaman[0].tanggalMulai).toLocaleDateString(),
      tanggalSelesai: new Date(peminjaman.detailPeminjaman[0].tanggalSelesai).toLocaleDateString(),
      ruangan: peminjaman.detailPeminjaman[0].ruangan.namaRuangan,
      jamMulai: peminjaman.detailPeminjaman[0].jamMulai,
      jamSelesai: peminjaman.detailPeminjaman[0].jamSelesai,
      tanggalKeputusan: new Date().toLocaleDateString()
    });

    doc.render();

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });

    const outputDir = path.resolve("public/downloads/surat");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${peminjaman.idPeminjaman}.docx`);
    fs.writeFileSync(outputPath, buffer);

    
    const username = peminjaman.peminjam.username;
    const nama = peminjaman.peminjam.nama;
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
    const filename = `${username}_${nama}_${formattedDate}.pdf`
    const pdfPath = path.join(outputDir, filename);     

    libreConvert.convert(fs.readFileSync(outputPath), '.pdf', undefined, async(err, done) => {
      if (err) {
        console.error('Error during PDF generation:', err);
        return res.status(500).json({ error: 'Error during PDF generation' });
      }

      fs.writeFileSync(pdfPath, done);
      console.log(`File converted successfully: ${pdfPath}`);

      fs.unlinkSync(outputPath);

      await Peminjaman.update(
        {
          idAdmin,
          statusPengajuan: 'Disetujui',
          tanggalKeputusan: new Date(),
          suratPeminjaman: filename
        },
        { where: { idPeminjaman } }
      );

      const detailPeminjaman = await DetailPeminjaman.findOne({ where: { idPeminjaman } });

      if (!detailPeminjaman) {
        return res.status(404).json({ message: 'DetailPeminjaman not found' });
      }

      await Ruangan.update(
        { statusKetersediaan: 'Dipinjam' },
        { where: { idRuangan: detailPeminjaman.idRuangan } }
      );

      const jamSelesai = peminjaman.detailPeminjaman[0].jamSelesai;
      const tanggalMulai = peminjaman.detailPeminjaman[0].tanggalMulai;
      const tanggalSelesai = peminjaman.detailPeminjaman[0].tanggalSelesai;

      const endDateTime = new Date(tanggalSelesai + ' ' + jamSelesai);

            schedule.scheduleJob(endDateTime, async function() {
              const detailPeminjaman = await DetailPeminjaman.findOne({ where: { idPeminjaman } });
      
              if (detailPeminjaman) {
                await Ruangan.update(
                  { statusKetersediaan: 'Tersedia' },
                  { where: { idRuangan: detailPeminjaman.idRuangan } }
                );
              }
            });
      
      const user = peminjaman.peminjam;
      console.log(user);
      sendNotification(user.idUser, `Peminjaman ruangan Anda dengan ID ${idPeminjaman} telah diterima oleh admin`);

      res.redirect('/admin/daftar-peminjaman');
    });
  } catch (error) {
    console.error('Error during PDF generation:', error);
    next(error);
  }
};

const daftarPeminjaman = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const user = await User.findOne({ where: { idUser: userId } });

    const peminjamans = await Peminjaman.findAll({
      where: {statusPengajuan: 'Menunggu'},
      attributes: ['idPeminjaman', 'kegiatan', 'tanggalMulai','tanggalSelesai', 'formulir'],
      include: [
      {
        model: User,
        as: 'peminjam',
        attributes: ['nama', 'username', 'noHp'],
      },
      {
        model: User,
        as: 'admin',
        attributes: ['nama'],
      },
      {
        model: DetailPeminjaman,
        as: 'detailPeminjaman',
        attributes: ['tanggalMulai','tanggalSelesai', 'jamMulai', 'jamSelesai'],
        include: [
          {
            model: Ruangan,
            as: 'ruangan',
            attributes: ['namaRuangan'],
          },
        ],
      },
    ],
  });
    res.render('admin/daftar-peminjaman', { currentPage: 'peminjaman', user, peminjamans });
  } catch (error) {
    next(error);
  }
};

const tolakPeminjamanForm = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const user = await User.findOne({ where: { idUser: userId } });
    const idPeminjaman = req.params.idPeminjaman;

    res.render('admin/tolakpeminjaman', { currentPage: 'peminjaman', user, idPeminjaman });
  } catch (err) {
    next(err);
  }
};

const tolakPeminjaman = async (req, res, next) => {
    try {
        const idPeminjaman = req.params.idPeminjaman;
        const idAdmin = req.user.idUser;
        const alasanPenolakan = req.body.alasanPenolakan;

        const updatedPeminjaman = await Peminjaman.update(
            {
                idAdmin,
                statusPengajuan: 'Ditolak',
                tanggalKeputusan: new Date(), 
                alasanPenolakan: alasanPenolakan,
            },
            {
                where: { idPeminjaman }
            }
        );
        if (updatedPeminjaman[0] === 0) {
            return res.status(404).json({ message: 'Peminjaman not found' });
        }

        const peminjaman = await Peminjaman.findByPk(idPeminjaman, {
          include: [
            {model: User, as: 'peminjam', attributes: ['idUser', 'nama', 'username', 'noHp']},
          ]
        });


        const user = peminjaman.peminjam;
        sendNotification(user.idUser, `Peminjaman ruangan Anda dengan ID ${idPeminjaman} telah ditolak oleh admin. Alasan penolakan: ${alasanPenolakan}`);


        res.redirect('/admin/daftar-peminjaman');
    } catch (error) {
        next(error);
    }
};

const rekapPeminjaman = async (req, res, next) => {
    try {
        const userId = req.user.idUser;
        const user = await User.findOne({ where: { idUser: userId } });

        const peminjamans = await Peminjaman.findAll({
          where: {statusPengajuan: {[Op.not]: 'Menunggu'}},
          attributes: ['idPeminjaman', 'kegiatan', 'tanggalMulai','tanggalSelesai', 'formulir', 'statusPengajuan','createdAt'],
          include: [
          {
            model: User,
            as: 'peminjam',
            attributes: ['nama', 'username', 'noHp'],
          },
          {
            model: User,
            as: 'admin',
            attributes: ['nama'],
          },
          {
            model: DetailPeminjaman,
            as: 'detailPeminjaman',
            attributes: ['tanggalMulai','tanggalSelesai', 'jamMulai', 'jamSelesai'],
            include: [
              {
                model: Ruangan,
                as: 'ruangan',
                attributes: ['namaRuangan'],
              },
            ],
          },
        ],
      });
        res.render('admin/rekap-peminjaman', { currentPage : 'rekap-peminjaman', user, peminjamans });
      } catch (error) {
        next(error);
  }
 };



const downloadRekap = async (req, res, next) => {
  try {
    const userId = req.user.idUser;
    const user = await User.findOne({ where: { idUser: userId } });

    const peminjamans = await Peminjaman.findAll({
      where: { statusPengajuan: { [Op.not]: 'Menunggu' } },
      attributes: [
        'idPeminjaman',
        'kegiatan',
        'tanggalMulai',
        'tanggalSelesai',
        'tanggalKeputusan',
        'formulir',
        'statusPengajuan',
        'createdAt',
      ],
      include: [
        {
          model: User,
          as: 'peminjam',
          attributes: ['nama', 'username', 'noHp'],
        },
        {
          model: User,
          as: 'admin',
          attributes: ['nama'],
        },
        {
          model: DetailPeminjaman,
          as: 'detailPeminjaman',
          attributes: ['tanggalMulai', 'tanggalSelesai', 'jamMulai', 'jamSelesai'],
          include: [
            {
              model: Ruangan,
              as: 'ruangan',
              attributes: ['namaRuangan'],
            },
          ],
        },
      ],
    });

    const templatePath = path.join(__dirname, '../views/admin/template-rekap.ejs');
    const html = await ejs.renderFile(templatePath, { user, peminjamans });

    const pdfOptions = {
      format: 'A4',
      orientation: 'landscape',
      border: '10mm',
    };

    const pdfPath = path.join(__dirname, '../public/downloads/rekap.pdf');
    pdf.create(html, pdfOptions).toFile(pdfPath, (err, result) => {
      if (err) {
        return next(err);
      }
      res.download(result.filename);
    });
  } catch (error) {
    next(error);
  }
};

 
const downloadSurat = async (req, res, next) => {
  
  try {
    const { idPeminjaman } = req.params;
    const peminjaman = await Peminjaman.findByPk(idPeminjaman);

    if(!peminjaman) {
      return res.status(404).json({ message: 'Peminjaman not found' });
    }

    const filePath = path.resolve('public/downloads/surat', peminjaman.suratPeminjaman);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
 } catch (error) {
    next(error);
  }
};


module.exports = {
    formPinjamRuangan,
    pinjamRuangan,
    dataPeminjaman,
    detailPeminjaman,
    batalPeminjaman,
    daftarPeminjaman,
    approvePeminjaman,
    tolakPeminjamanForm,
    tolakPeminjaman,
    rekapPeminjaman,
    downloadRekap,
    downloadSurat
}