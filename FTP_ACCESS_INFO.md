# Sarang House FTP Access Information

## Connection Details

**Server:** saranghouse.tengerly.com (or 165.227.156.92)  
**Protocol:** FTP (Plain FTP - not FTPS)  
**Port:** 21  
**Username:** `saranghouse_ftp`  
**Password:** `+qD3hu6JjdzLkMkyQpKVfQ==`

⚠️ **Important:** Use **Plain FTP** (not FTPS/TLS). The server uses passive mode.

## Directory Structure

```
/srv/apps/saranghouse/
├── app/                    # Next.js app directory
├── public/                 # Public assets
│   └── images/            # Upload images here
├── logs/                   # Application logs
└── node_modules/          # Dependencies (do not modify)
```

## FTP Client Configuration

### FileZilla
1. Host: `saranghouse.tengerly.com` (or `165.227.156.92`)
2. Username: `saranghouse_ftp`
3. Password: `+qD3hu6JjdzLkMkyQpKVfQ==`
4. Port: `21`
5. **Encryption:** Use plain FTP (NOT "Require explicit FTP over TLS")
6. **Transfer Mode:** Passive (default)

## Image Upload Best Practices

1. **Upload Location:** `/public/images/`
2. **Supported Formats:** JPG, PNG, WebP, GIF
3. **Recommended Size:** Max 2MB per image
4. **Naming:** Use lowercase, hyphens instead of spaces

## Management Commands

```bash
# Check status
pm2 status saranghouse

# View logs
pm2 logs saranghouse

# Restart application
pm2 restart saranghouse

# Rebuild after changes
cd /srv/apps/saranghouse
npm run build
pm2 restart saranghouse
```

---

**Application:** Sarang House  
**Domain:** https://saranghouse.tengerly.com  
**Port:** 3013  
**Last Updated:** February 13, 2026
