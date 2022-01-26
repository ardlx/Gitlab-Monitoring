const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mssql = require('mssql')

const router = express.Router();

router.use(cors())
router.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
router.use(bodyParser.json({ limit: '10mb', extended: true }))


router.get('/', (req, res) => {
    let getIp = req.socket.remoteAddress
    let myIP = getIp.split(':')[3]
    res.send(myIP)
})

// ========================== your connection here ==============================//
const knex_sd_sql_training = require('knex')({
    client: 'mssql',
    connection: {
        server: 'sd_sql_training',
        user: 'sa',
        password: '81at84',
        database: 'GitlabMonitoring',
        options: {
            "enableArithAbort": true
        }
    }
});

const knex_HRDSQL = require('knex')({
    client: 'mssql',
    connection: {
        server: 'HRDSQL',
        user: 'sa',
        password: '81at84',
        database: 'GroupCompanyInformation',
        options: {
            "enableArithAbort": true
        }
    }
});

const ProgrammersProjects = {
    user: "sa",
    password: "81at84",
    server: "sd_sql_training",
    database: "GitLabMonitoring",
    options: {
      abortTransactionOnError: true,
      enableArithAbort: true,
      encrypt: false,
      },
  };


// ========================== your routes here ==============================//

// ========================== GET ==============================// Nhel

    router.get('/Gitlab_User', (req, res) => {
        knex_sd_sql_training.select('Users.*')
            .from("Users")
            .leftJoin('M_Sections', 'Users.SectionID', '=', 'M_Sections.SectionID')
            .whereNull('Users.DeletedDate')
            .orderBy([
                {   column: 'BlnInclude', order: 'desc'},
                {   column: 'M_Sections.SectionName'},
                {   column: 'TeamID'},
                {   column: 'Name'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/GitlabAdministrator', (req, res) => {
        knex_sd_sql_training.select()
            .from("Users")
            .whereNull('DeletedDate')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_UserEmail', (req, res) => {
        let strEmail = req.query.Email

        knex_sd_sql_training.select()
            .from("Users")
            .where("Email", strEmail)
            .whereNull('DeletedDate')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/M_DisposedTypes', (req, res) => {
        knex_sd_sql_training.select()
            .from("M_DisposedTypes")
            .whereNull('DeletedDate')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_Projects', (req, res) => {
        knex_sd_sql_training.select('Projects.*')
            .from("Projects")
            .leftJoin('M_Sections', 'Projects.SectionID', '=', 'M_Sections.SectionID')
            .whereNull('Projects.DeletedDate')
            .orderBy([
                {   column: 'M_Sections.SectionName'},
                {   column: 'Projects.Gitlab_ID'},
                {   column: 'Projects.Name'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_ProjectsID/:ID', (req, res) => {
        knex_sd_sql_training.select()
            .from("Projects")
            .where("ID", req.params.ID)
            .whereNull('DeletedDate')
            .orderBy([
                {   column: 'SectionID'},
                {   column: 'Gitlab_ID'},
                {   column: 'Name'},
            ])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_Projects_ProjectOwner', (req, res) => {
        knex_sd_sql_training.select()
            .distinct('ProjectOwner')
            .from("Projects")
            .whereNull('DeletedDate')
            .whereNotNull('ProjectOwner')
            .orderBy([
                {   column: 'ProjectOwner'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_Data', (req, res) => {
        knex_sd_sql_training.select()
            .from("Gitlab_Data")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_Projects_Commit', (req, res) => {
        knex_sd_sql_training.select()
            .from("Gitlab_Projects_Commit")
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_UserInfo/:ID', (req, res) => {
        knex_sd_sql_training.select()
            .from("Users")
            .where("ID", req.params.ID)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Gitlab_ProjectsInfo/:ID', (req, res) => {
        knex_sd_sql_training.select()
            .from("Projects")
            .where("ID", req.params.ID)
            .whereNull('DeletedDate')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Sections', (req, res) => {
        knex_sd_sql_training.select()
            .from("M_Sections")
            .whereNull('DeletedDate')
            .orderBy('SectionName')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Teams', (req, res) => {
        knex_sd_sql_training.select()
            .from("M_Teams")
            .whereNull('DeletedDate')
            .orderBy('TeamName')
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Companies', (req, res) => {
        knex_HRDSQL.select()
            .from("Companies")
            .whereNull('DeletedDate')
            .whereIn('CompanyCode', function () {this.select('CompanyCode').from('Departments').where("DeletedDate", null);})
            .orderBy([
                {   column: 'CompanyName'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/Departments', (req, res) => {
        knex_HRDSQL.select()
            .from("Departments")
            .innerJoin("Companies", 'Companies.CompanyCode', '=', 'Departments.CompanyCode')
            .whereNull('Companies.DeletedDate')
            .whereNull('Departments.DeletedDate')
            .orderBy([
                {   column: 'DepartmentName'},])
            .then(data => {
                res.send(data)
            }).catch(err => {
                res.send(err), console.log(err);
            })
    }),
    router.get('/CompaniesDistinct', (req, res) => {
        knex_HRDSQL.select()
            .distinct('CompanyName')
            .from("Companies")
            .whereNull('DeletedDate')
            .orderBy([
                {   column: 'CompanyName'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/DepartmentsDistinct', (req, res) => {
        knex_HRDSQL.select()
            .distinct('DepartmentName')
            .from("Departments")
            .whereNull('DeletedDate')
            .orderBy([
                {   column: 'DepartmentName'},])
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.get('/NotificationData', (req, res) => {
        let getIp = req.socket.remoteAddress
        let myIP = getIp.split(':')[3]

        knex_sd_sql_training.select()
            .from('NotificationData')
            .where('IpAddress', myIP)
            .where('DeletedDate', null)
            .then(data => {
                res.send(data)
            }).catch(err => {
                res.send(err)
                console.log(err)
            })
    }),

    // ========================== POST ==============================// Nhel

    router.post('/Gitlab_UserInsert', (req, res) => {
        let objData = req.body

        knex_sd_sql_training('Users')
            .insert({
                ID: objData.ID,
                SectionID: objData.SectionID,
                TeamID: objData.TeamID,
                Name: objData.Name,
                UserName: objData.UserName,
                Email: objData.Email,
                Avatar: objData.Avatar,
                BlnInclude: objData.BlnInclude,
                UpdatedDate: objData.UpdatedDate,
                UpdatedByUserID: objData.UpdatedByUserID,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/Gitlab_ProjectsInsert', (req, res) => {
        let objData = req.body

        knex_sd_sql_training('Projects')
            .insert({
                SectionID: objData.SectionID,
                Name: objData.Name,
                Gitlab_ID: objData.Gitlab_ID,
                JapaneseAdviser: objData.JapaneseAdviser,
                SectionHead: objData.SectionHead,
                Avatar: objData.Avatar,
                URL: objData.URL,
                ProjectCategory: objData.ProjectCategory,
                Type: objData.Type,
                DisposedType: objData.DisposedType,
                ProjectOwner: objData.ProjectOwner,
                ProjectUser: objData.ProjectUser,
                ExpectedReleaseDate: objData.ExpectedReleaseDate,
                ReleasedDate: objData.ReleasedDate,
                CreatedDate: objData.CreatedDate,
                UpdatedDate: objData.UpdatedDate,
                UpdatedByUserID: objData.UpdatedByUserID,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/Gitlab_UserDelete/:id', (req, res) => {
        knex_sd_sql_training('Users')
            .del()
            .where('ID', req.params.ID)
            .then(data => {
                res.send(data)
            }).catch(err => { res.send(err) })
    }),
    router.post('/Gitlab_UserUpdate', (req, res) => {
        let objData = req.body

        knex_sd_sql_training('Users')
            .where('ID', objData.ID)
            .update({
                SectionID: objData.SectionID,
                TeamID: objData.TeamID,
                EmployeeCode: objData.EmployeeCode,
                Name: objData.Name,
                UserName: objData.UserName,
                Email: objData.Email,
                Avatar: objData.Avatar,
                BlnInclude: objData.BlnInclude,
                UpdatedDate: objData.UpdatedDate,
                UpdatedByUserID: objData.UpdatedByUserID,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => {
                res.send(err)
                console.log(err)
            })
    }),
    router.post('/Gitlab_ProjectsUpdate', (req, res) => {
        let objData = req.body

        knex_sd_sql_training('Projects')
            .where('ID', objData.ID)
            .update({
                SectionID: objData.SectionID,
                Name: objData.Name,
                Gitlab_ID: objData.Gitlab_ID,
                JapaneseAdviser: objData.JapaneseAdviser,
                SectionHead: objData.SectionHead,
                Avatar: objData.Avatar,
                URL: objData.URL,
                ProjectCategory: objData.ProjectCategory,
                Type: objData.Type,
                DisposedType: objData.DisposedType,
                ProjectOwner: objData.ProjectOwner,
                ProjectUser: objData.ProjectUser == "[]" ? "" : objData.ProjectUser,
                ExpectedReleaseDate: objData.ExpectedReleaseDate,
                ReleasedDate: objData.ReleasedDate,
                UpdatedDate: objData.UpdatedDate,
                UpdatedByUserID: objData.UpdatedByUserID,
            })
            .then(data => {
                res.send(objData)
            }).catch(err => { res.send(err) })
    }),
    router.post('/Gitlab_DataUpdate', (req, res) => {
        let objData = req.body
        let sql = `UPDATE Gitlab_Data  SET ${objData.Column} = 1  WHERE Gitlab_ID = ${objData.Gitlab_ID}  AND Gitlab_MM = ${objData.Gitlab_MM}  AND Gitlab_YYYY = ${objData.Gitlab_YYYY}`

        knex_sd_sql_training.select()
            .from("Gitlab_Data")
            .where('Gitlab_ID', objData.Gitlab_ID)
            .andWhere('Gitlab_MM', objData.Gitlab_MM)
            .andWhere('Gitlab_YYYY', objData.Gitlab_YYYY)
            .then(data => {
                if (data.length != 0) {
                    knex_sd_sql_training.raw(sql)
                        .then(data => {
                            res.send(objData)
                        }).catch(err => { res.send(err) })
                } else {
                    knex_sd_sql_training('Gitlab_Data')
                        .insert({
                            Gitlab_ID: objData.Gitlab_ID,
                            Gitlab_MM: objData.Gitlab_MM,
                            Gitlab_YYYY: objData.Gitlab_YYYY
                        })
                        .then(data => {
                            knex_sd_sql_training.raw(sql)
                                .then(data => {
                                    res.send(objData)
                                }).catch(err => { res.send(err) })
                        }).catch(err => { res.send(err) })
                }
            }).catch(err => { res.send(err) })
    }),
    router.post('/Gitlab_Projects_CommitUpdate', (req, res) => {
        let objData = req.body
        let sql = `UPDATE Gitlab_Projects_Commit  SET ${objData.Column} = 1  WHERE Gitlab_ID = ${objData.Gitlab_ID}  AND Gitlab_MM = ${objData.Gitlab_MM}  AND Gitlab_YYYY = ${objData.Gitlab_YYYY}`

        knex_sd_sql_training.select()
            .from("Gitlab_Projects_Commit")
            .where('Gitlab_ID', objData.Gitlab_ID)
            .andWhere('Gitlab_MM', objData.Gitlab_MM)
            .andWhere('Gitlab_YYYY', objData.Gitlab_YYYY)
            .then(data => {
                if (data.length != 0) {
                    knex_sd_sql_training.raw(sql)
                        .then(data => {
                            res.send(objData)
                        }).catch(err => { res.send(err) })
                } else {
                    knex_sd_sql_training('Gitlab_Projects_Commit')
                        .insert({
                            Gitlab_ID: objData.Gitlab_ID,
                            Gitlab_MM: objData.Gitlab_MM,
                            Gitlab_YYYY: objData.Gitlab_YYYY
                        })
                        .then(data => {
                            knex_sd_sql_training.raw(sql)
                                .then(data => {
                                    res.send(objData)
                                }).catch(err => { res.send(err) })
                        }).catch(err => { res.send(err) })
                }
            }).catch(err => { res.send(err) })
    }),
    router.post('/NotificationDataInsertUpdate', (req, res) => {
        let objData = req.body
        let getIp = req.socket.remoteAddress
        let myIP = getIp.split(':')[3]

        knex_sd_sql_training('NotificationData')
            .where('IpAddress', myIP)
            .andWhere('Gitlab_ID', objData.Gitlab_ID)
            .then(data => {
                if (data.length == 0) {
                    knex_sd_sql_training('NotificationData')
                        .insert({
                            IpAddress: myIP,
                            Gitlab_ID: objData.Gitlab_ID,
                            NotifDate: objData.NotifDate,
                            DeletedDate: objData.DeletedDate,
                            UpdatedDate: objData.UpdatedDate,
                            UpdatedByUserID: objData.UpdatedByUserID
                        })
                        .then(data => {
                            res.send(objData)
                        }).catch(err => {
                            res.send(err)
                            console.log(err)
                        })
                } else {
                    knex_sd_sql_training('NotificationData')
                        .update({
                            NotifDate: objData.NotifDate,
                            DeletedDate: objData.DeletedDate,
                            UpdatedDate: objData.UpdatedDate,
                            UpdatedByUserID: objData.UpdatedByUserID
                        })
                        .where('IpAddress', myIP)
                        .where('Gitlab_ID', objData.Gitlab_ID)
                        .then(data => {
                            res.send(objData)
                        }).catch(err => {
                            res.send(err)
                            console.log(err)
                        })
                }
            }).catch(err => {
                res.send(err)
                console.log(err)
            })
    }),

    // =========================== CLASSIC STYLE QUERY ================================== //

    // ========================== GET ==============================// Janren

    router.get("/GetProgrammers", (req, res) => {
        // mssql.close()
        let sql =  `SELECT      Users.*
                    FROM        SD_SQL_TRAINING.GitlabMonitoring.dbo.Users AS Users
                    WHERE       Users.SectionID IS NOT NULL
                                AND Users.SectionID NOT IN (5)
                                AND Users.BlnInclude = 1
                    ORDER BY    Users.SectionID,
                                Users.TeamID,
                                Users.Name`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProgrammers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProgrammers Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetMembersList", (req, res) => {
        // mssql.close()
        let sql =  `SELECT      Users.*
                    FROM        SD_SQL_TRAINING.GitlabMonitoring.dbo.Users AS Users
                    WHERE       Users.SectionID IS NOT NULL
                                AND Users.SectionID NOT IN (5)
                                AND Users.BlnInclude = 1
                    ORDER BY    Users.Name`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProgrammers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProgrammers Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetProgrammerLogin", (req, res) => {
        // mssql.close()
        let sql =  `SELECT      Users.*
                    FROM        SD_SQL_TRAINING.GitlabMonitoring.dbo.Users AS Users
                    ORDER BY    Users.SectionID,
                                Users.TeamID,
                                Users.Name`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProgrammers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProgrammers Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetProgrammersProjects", (req, res) => {
        // mssql.close()
        let sql =  `SELECT	    Projects.*
                    FROM	    SD_SQL_TRAINING.GitlabMonitoring.dbo.Projects AS Projects
                    WHERE	    (Projects.DisposedType = 0 OR Projects.DisposedType IS NULL)
                                AND Projects.DeletedDate IS NULL`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProgrammersProjects Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProgrammersProjects Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetProjectGitLabID", (req, res) => {
        // mssql.close()
        let ID = req.query.ID
        let sql =  `SELECT	    Projects.*
                    FROM	    SD_SQL_TRAINING.GitlabMonitoring.dbo.Projects AS Projects
                    WHERE	    Projects.ID = ${ID}
                                AND (Projects.DisposedType = 0 OR Projects.DisposedType IS NULL)
                                AND Projects.DeletedDate IS NULL`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProjectGitLabID Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProjectGitLabID Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetTaskMonitoring", (req, res) => {
        // mssql.close()
        let SectionID = req.query.SectionID
        let sql =  `SELECT      TaskMonitoring.SectionID AS SectionID,
                                Projects.SectionID AS ProjectSectionID,
                                M_Sections.SectionName,
                                TaskMonitoring.TeamID,
                                M_Teams.TeamName,
                                TaskMonitoring.SystemMonitoringID,
                                TaskMonitoring.ProjectGitLabID,
                                Projects.Name,
                                Projects.Avatar,
                                Projects.Type,
                                M_ProjectTypes.TypeName,
                                Projects.ExpectedReleaseDate,
                                TaskMonitoring.CreatedDate,
                                TaskMonitoring.UpdatedDate,
                                TaskMonitoring.DeletedDate
                    FROM        SD_SQL_TRAINING.GitlabMonitoring.dbo.TaskMonitoring     AS TaskMonitoring
                    INNER JOIN	SD_SQL_TRAINING.GitlabMonitoring.dbo.Projects           AS Projects
                                                                                        ON TaskMonitoring.ProjectGitLabID = Projects.Gitlab_ID
                    LEFT JOIN	SD_SQL_TRAINING.GitlabMonitoring.dbo.M_Sections         AS M_Sections
                                                                                        ON TaskMonitoring.SectionID = M_Sections.SectionID
                    LEFT JOIN	SD_SQL_TRAINING.GitlabMonitoring.dbo.M_Teams            AS M_Teams
                                                                                        ON TaskMonitoring.TeamID = M_Teams.TeamID
                    LEFT JOIN	SD_SQL_TRAINING.GitlabMonitoring.dbo.M_ProjectTypes     AS M_ProjectTypes
                                                                                        ON Projects.Type = M_ProjectTypes.TypeID
                    WHERE       TaskMonitoring.SectionID = ${SectionID}
                                AND TaskMonitoring.DeletedDate IS NULL
                                AND (Projects.DisposedType = 0 OR Projects.DisposedType IS NULL)
                                AND Projects.DeletedDate IS NULL
                    ORDER BY    TaskMonitoring.TeamID,
                                TaskMonitoring.ProjectGitLabID`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetTaskMonitoring Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetTaskMonitoring Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/CheckMembers", (req, res) => {
        // mssql.close()
        let ID = req.query.ID;
        let sql =  `SELECT      Users.*
                    FROM        SD_SQL_TRAINING.GitlabMonitoring.dbo.Users AS Users
                    WHERE       Users.ID = '${ID}'
                    ORDER BY    Users.SectionID,
                                Users.TeamID,
                                Users.Name`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('CheckMembers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('CheckMembers Query Error', error)
                }
                else{
                    if(recordset.recordsets[0].length != 0 ){
                        res.send(recordset.recordsets[0])
                    }
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetJapaneseAdvisers", (req, res) => {
        // mssql.close()
        let sql =  `SELECT		M_AdvisersJapanese.*
                    FROM		M_AdvisersJapanese`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetJapaneseAdvisers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetJapaneseAdvisers Query Error', error)
                }
                else{
                    if(recordset.recordsets[0].length != 0 ){
                        res.send(recordset.recordsets[0])
                    }
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetSectionHeadAdvisers", (req, res) => {
        // mssql.close()
        let sql =  `SELECT		M_AdvisersSectionHead.*
                    FROM		M_AdvisersSectionHead`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetSectionHeadAdvisers Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetSectionHeadAdvisers Query Error', error)
                }
                else{
                    if(recordset.recordsets[0].length != 0 ){
                        res.send(recordset.recordsets[0])
                    }
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetProjectCategories", (req, res) => {
        // mssql.close()
        let sql =  `SELECT		M_ProjectCategory.*
                    FROM		M_ProjectCategory`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetProjectCategories Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetProjectCategories Query Error', error)
                }
                else{
                    if(recordset.recordsets[0].length != 0 ){
                        res.send(recordset.recordsets[0])
                    }
                }
            })
        })
        // mssql.close()
    }),

    // ========================== POST ==============================// Janren

    router.post('/InsertToTaskMonitoring', (req, res) => {
        // mssql.close()
        let objData = req.body
        let sql =  `INSERT INTO SD_SQL_TRAINING.GitlabMonitoring.dbo.TaskMonitoring
                                (SectionID,
                                 TeamID,
                                 SystemMonitoringID,
                                 ProjectGitLabID,
                                 CreatedDate,
                                 UpdatedDate)
                    VALUES
                                (${objData.SectionID},
                                 ${objData.TeamID},
                                 ${objData.SystemMonitoringID},
                                 ${objData.ProjectGitLabID},
                                 getdate(),
                                 getdate())`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('InsertToTaskMonitoring Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('InsertToTaskMonitoring Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.post('/RemoveFromTaskMonitoring', (req, res) => {
        // mssql.close()
        let objData = req.body
        let sql =  `DELETE FROM SD_SQL_TRAINING.GitlabMonitoring.dbo.TaskMonitoring
                    WHERE       SectionID = ${objData.SectionID}
                                AND TeamID = ${objData.TeamID}
                                AND SystemMonitoringID = ${objData.SystemMonitoringID}
                                AND ProjectGitLabID = ${objData.ProjectGitLabID}`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('RemoveFromTaskMonitoring Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('RemoveFromTaskMonitoring Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),

    // =========================== GET ABSENT AUTOMATIC ================================= //

    router.post('/SaveAbsentsToday', (req, res) => {
        // mssql.close()
        let sql =  `EXECUTE dbo.GetAbsentsToday`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('SaveAbsentsToday Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('SaveAbsentsToday Query Error', error)
                } else{
                    res.send(recordset.recordsets[0])
                }
            })
        })
        // mssql.close()
    }),
    router.get("/GetAbsents", (req, res) => {
        // mssql.close()
        let sql =  `SELECT		Absents.*
                    FROM		SD_SQL_TRAINING.GitlabMonitoring.dbo.Absents AS Absents`

        mssql.connect(ProgrammersProjects, function(error) {
            if (error) {
                console.log('GetAbsents Error', error);
            }
            var request = new mssql.Request();
            request.query(sql, function (error, recordset) {
                if (error){ 
                    console.log('GetAbsents Query Error', error)
                }
                else{
                    if(recordset.recordsets[0].length != 0 ){
                        res.send(recordset.recordsets[0])
                    }
                }
            })
        })
        // mssql.close()
    }),
    
    module.exports = router;