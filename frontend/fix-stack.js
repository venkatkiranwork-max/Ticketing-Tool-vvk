const fs = require('fs');
const path = require('path');
const dir = './src/features/dashboard/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));
files.push('./src/pages/DashboardPage.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/<Stack([^>]+)>/g, (match, p1) => {
    let newProps = p1;
    let sxItems = [];
    
    const extractProp = (regex, key) => {
      newProps = newProps.replace(regex, (m, val) => {
        sxItems.push(`${key}: '${val}'`);
        return '';
      });
    };
    const extractPropUnquoted = (regex, key) => {
      newProps = newProps.replace(regex, (m, val) => {
        sxItems.push(`${key}: ${val}`);
        return '';
      });
    };
    
    extractProp(/alignItems=["']([^"']+)["']/g, 'alignItems');
    extractProp(/justifyContent=["']([^"']+)["']/g, 'justifyContent');
    extractPropUnquoted(/mb={([^}]+)}/g, 'mb');
    extractPropUnquoted(/mt={([^}]+)}/g, 'mt');
    
    if (sxItems.length > 0) {
      if (/sx={{/.test(newProps)) {
        newProps = newProps.replace(/sx={{/, 'sx={{ ' + sxItems.join(', ') + ', ');
      } else {
        newProps += ` sx={{ ${sxItems.join(', ')} }}`;
      }
    }
    
    newProps = newProps.replace(/\s+/g, ' ');
    return `<Stack${newProps}>`;
  });
  
  if (file.endsWith('DashboardPage.tsx')) {
    content = content.replace(/const openDrawer = useUiStore\(\(s\) => s\.openDrawer\);\n?/g, '');
    content = content.replace(/import { useUiStore } from '@\/store\/uiStore';\n?/g, '');
    content = content.replace(/import { IssueDetailsDrawer } from '@\/components\/ui\/IssueDetailsDrawer';\n?/g, '');
    content = content.replace(/<IssueDetailsDrawer \/>\n?/g, '');
  }

  fs.writeFileSync(file, content);
});
console.log('Fixed TS issues');
