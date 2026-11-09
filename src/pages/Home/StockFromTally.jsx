import { useState } from 'react'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import './StockFromTally.css'

export default function StockFromTally() {
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState([])
  const [unit, setUnit] = useState('Boxes')
  const [error, setError] = useState('')
  const [imported, setImported] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    setError('')
    setImported(false)
    setRows([])
    setFile(selected)

    const extension = selected.name.split('.').pop().toLowerCase()

    if (!['csv', 'xlsx', 'xls'].includes(extension)) {
      setError('Please upload a CSV or Excel file.')
      setFile(null)
      event.target.value = ''
      return
    }

    setLoading(true)

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, {
          type: 'array'
        })

        const sheet = workbook.Sheets[workbook.SheetNames[0]]

        const data = XLSX.utils.sheet_to_json(sheet, {
          defval: ''
        })

        const normalized = data.map((item, index) => {
          const findValue = (names) => {
            const key = Object.keys(item).find(k =>
              names.includes(k.toLowerCase().trim().replace(/[\s_-]/g, ''))
            )
            return key ? item[key] : ''
          }

          return {
            id: index + 1,
            name: String(findValue([
              'tile', 'tilename', 'product', 'productname', 'item', 'itemname', 'name'
            ])).trim(),
            sku: String(findValue([
              'sku', 'code', 'itemcode', 'productcode'
            ])).trim(),
            size: String(findValue([
              'size', 'tilesize', 'dimension'
            ])).trim(),
            stock: Number(findValue([
              'stock', 'quantity', 'qty', 'boxes', 'closingstock'
            ])) || 0,
            price: Number(findValue([
              'price', 'rate', 'unitprice', 'sellingprice'
            ])) || 0
          }
        }).filter(item => item.name)

        if (!normalized.length) {
          setError('No valid tile records found. Please check your column headings.')
        } else {
          setRows(normalized)
        }
      } catch {
        setError('Unable to read this file. Please check the Excel or CSV format.')
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError('File could not be read. Please try again.')
      setLoading(false)
    }

    reader.readAsArrayBuffer(selected)
  }

  const handleImport = () => {
    if (!rows.length) return
    setImported(true)
  }

  const lowStock = rows.filter(item => item.stock < 10)
  const missingPrice = rows.filter(item => item.price <= 0)

  return (
    <section className="tally-section">
      <div className="tally-container">

        <motion.div
          className="tally-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="tally-eyebrow">
            <span />
            SMART STOCK MANAGEMENT
          </span>

          <h2>
            Your stock, always
            <br />
            <span>in sync.</span>
          </h2>

          <p>
            Bring your Tally stock directly into Tile Quote.
            Upload your Excel or CSV file, review every change
            and keep your showroom inventory organised.
          </p>
        </motion.div>

        <div className="tally-workspace">

          {/* UPLOAD PANEL */}

          <div className="tally-upload-panel">

            <div className="tally-panel-heading">
              <div className="tally-icon">↥</div>
              <div>
                <small>STEP 01</small>
                <h3>Import your stock</h3>
              </div>
            </div>

            <label className="tally-dropzone">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFile}
              />

              <div className="tally-upload-icon">📁</div>

              <strong>
                {file ? file.name : 'Drop your stock file here'}
              </strong>

              <span>
                or click to browse from your device
              </span>

              <small>CSV · XLSX · XLS</small>
            </label>

            <div className="tally-file-info">
              <span>📊</span>
              <div>
                <strong>Excel / CSV supported</strong>
                <small>Upload your latest Tally stock report.</small>
              </div>
            </div>

            <div className="tally-unit-control">
              <label>Stock measurement unit</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
              >
                <option value="Boxes">Boxes</option>
                <option value="Sq Ft">Square Feet (Sq Ft)</option>
                <option value="Sq M">Square Metres (Sq M)</option>
              </select>
            </div>

            {loading && (
              <div className="tally-message">
                Reading your stock file...
              </div>
            )}

            {error && (
              <div className="tally-error">{error}</div>
            )}

            {file && !loading && rows.length > 0 && (
              <div className="tally-success">
                ✓ {rows.length} stock records successfully read.
              </div>
            )}

          </div>

          {/* PREVIEW PANEL */}

          <div className="tally-preview-panel">

            <div className="tally-preview-header">
              <div>
                <small>STEP 02</small>
                <h3>Stock preview</h3>
              </div>

              <span className="tally-preview-tag">
                {rows.length ? 'READY TO REVIEW' : 'AWAITING FILE'}
              </span>
            </div>

            <div className="tally-stats">
              <div>
                <small>Total products</small>
                <strong>{rows.length}</strong>
              </div>

              <div>
                <small>Low stock</small>
                <strong className="tally-warning-number">
                  {lowStock.length}
                </strong>
              </div>

              <div>
                <small>Missing price</small>
                <strong>{missingPrice.length}</strong>
              </div>
            </div>

            <div className="tally-table-wrapper">
              <table className="tally-table">
                <thead>
                  <tr>
                    <th>Tile / Product</th>
                    <th>Size</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length > 0 ? (
                    rows.slice(0, 8).map(item => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                          <small>{item.sku || 'No SKU'}</small>
                        </td>
                        <td>{item.size || '—'}</td>
                        <td>{item.stock} {unit}</td>
                        <td>
                          {item.price > 0
                            ? `₹${item.price.toLocaleString('en-IN')}`
                            : '—'}
                        </td>
                        <td>
                          {item.stock < 10 ? (
                            <span className="tally-status low">
                              Low stock
                            </span>
                          ) : item.price <= 0 ? (
                            <span className="tally-status missing">
                              Check price
                            </span>
                          ) : (
                            <span className="tally-status good">
                              Ready
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="tally-empty">
                        <span>📋</span>
                        <strong>No stock records yet</strong>
                        <small>
                          Upload your Tally file to see the preview.
                        </small>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {rows.length > 8 && (
              <p className="tally-more">
                Showing 8 of {rows.length} products.
              </p>
            )}

            <div className="tally-validation">
              <span>✓</span>
              <div>
                <strong>Import validation</strong>
                <small>
                  {rows.length
                    ? `${lowStock.length} low-stock and ${missingPrice.length} missing-price records need attention.`
                    : 'Your file will be checked before importing.'}
                </small>
              </div>
            </div>

            <button
              type="button"
              className="tally-import-btn"
              disabled={!rows.length || loading || imported}
              onClick={handleImport}
            >
              {imported ? '✓ Preview import confirmed' : 'Confirm import'}
              <span>→</span>
            </button>

            {imported && (
              <div className="tally-import-success">
                Preview confirmed successfully. Backend stock update is
                not connected yet.
              </div>
            )}

          </div>

        </div>

        {/* BOTTOM FEATURES */}

        <div className="tally-benefits">
          <div>
            <span>01</span>
            <strong>Easy stock import</strong>
            <p>Bring your existing stock records into one place.</p>
          </div>

          <div>
            <span>02</span>
            <strong>Low-stock alerts</strong>
            <p>Identify tiles with fewer than 10 boxes available.</p>
          </div>

          <div>
            <span>03</span>
            <strong>Import safeguards</strong>
            <p>Review missing prices and stock records before confirming.</p>
          </div>
        </div>

      </div>
    </section>
  )
}
